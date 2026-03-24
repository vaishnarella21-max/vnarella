import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateWeeklyPackage, getFeedbackSummary } from "@/lib/openai/generate";
import { startOfWeek, format } from "date-fns";
import { Resend } from "resend";
import { WeeklyCreativesEmail } from "@/emails/WeeklyCreatives";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { businessId } = body;

    if (!businessId) {
      return NextResponse.json({ error: "businessId required" }, { status: 400 });
    }

    // Fetch business
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("*")
      .eq("id", businessId)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

    // Create package record with "generating" status
    const { data: pkg, error: pkgError } = await supabase
      .from("weekly_packages")
      .upsert(
        { business_id: businessId, week_start: weekStart, status: "generating" },
        { onConflict: "business_id,week_start" }
      )
      .select("id")
      .single();

    if (pkgError || !pkg) throw pkgError || new Error("Failed to create package");

    const packageId = pkg.id;

    // Get feedback summary for prompt context
    const feedback = await getFeedbackSummary(businessId, supabase);

    // Generate creatives
    const creatives = await generateWeeklyPackage(business, packageId, supabase, feedback);

    // Insert all creatives
    const { error: insertError } = await supabase.from("creatives").insert(creatives);
    if (insertError) throw insertError;

    // Mark package as ready
    await supabase
      .from("weekly_packages")
      .update({ status: "ready" })
      .eq("id", packageId);

    // Send email notification
    const weekLabel = format(new Date(weekStart), "MMMM d, yyyy");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const dashboardUrl = `${appUrl}/dashboard`;
    const previewImages = creatives
      .filter((c) => c.image_url)
      .slice(0, 3)
      .map((c) => c.image_url!);

    // Get user email from auth
    const { data: authUser } = await supabase.auth.admin.getUserById(business.user_id);
    const userEmail = authUser?.user?.email;

    if (userEmail) {
      await resend.emails.send({
        from: "CreativeLoop <creatives@yourverifieddomain.com>",
        to: [userEmail],
        subject: `${business.name}'s creatives for the week of ${weekLabel} are ready ✨`,
        react: React.createElement(WeeklyCreativesEmail, {
          businessName: business.name,
          weekLabel,
          previewImages,
          dashboardUrl,
          postCount: creatives.length,
        }),
      });
    }

    return NextResponse.json({ success: true, packageId, creativesCount: creatives.length });
  } catch (error: any) {
    console.error("Generation error:", error);

    // Mark package as failed if we have the ID
    try {
      const supabase = createServiceClient();
      const body = await request.clone().json().catch(() => ({}));
      if (body.businessId) {
        const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
        await supabase
          .from("weekly_packages")
          .update({ status: "failed" })
          .eq("business_id", body.businessId)
          .eq("week_start", weekStart);
      }
    } catch {}

    return NextResponse.json({ error: error.message || "Generation failed" }, { status: 500 });
  }
}
