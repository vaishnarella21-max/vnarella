import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { startOfWeek, format } from "date-fns";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, industry, tagline, tone, brand_color_1, brand_color_2, target_audience, platforms, avoid_content } = body;

    // Validate required fields
    if (!name || !industry || !tone || !target_audience || !platforms?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if business already exists for this user
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let businessId: string;

    if (existing) {
      // Update existing business
      const { data, error } = await supabase
        .from("businesses")
        .update({ name, industry, tagline, tone, brand_color_1, brand_color_2, target_audience, platforms, avoid_content })
        .eq("user_id", user.id)
        .select("id")
        .single();

      if (error) throw error;
      businessId = data.id;
    } else {
      // Create new business
      const { data, error } = await supabase
        .from("businesses")
        .insert({ user_id: user.id, name, industry, tagline, tone, brand_color_1, brand_color_2, target_audience, platforms, avoid_content })
        .select("id")
        .single();

      if (error) throw error;
      businessId = data.id;
    }

    // Trigger immediate first generation (fire and forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetch(`${appUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    }).catch(console.error);

    return NextResponse.json({ success: true, businessId });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
