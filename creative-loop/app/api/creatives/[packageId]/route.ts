import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DAY_NAMES } from "@/lib/supabase/types";

/**
 * GET /api/creatives/[packageId]
 * Returns creatives for a specific package (with ownership check via RLS).
 */
export async function GET(
  request: Request,
  { params }: { params: { packageId: string } }
) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: pkg, error } = await supabase
    .from("weekly_packages")
    .select(`
      id, week_start, status,
      creatives (
        id, day_index, post_type, caption, hashtags,
        video_script, image_url, rating, feedback_notes
      )
    `)
    .eq("id", params.packageId)
    .single();

  if (error || !pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const creatives = [...((pkg.creatives as any[]) || [])].sort(
    (a, b) => a.day_index - b.day_index
  );

  return NextResponse.json({ package: { ...pkg, creatives } });
}

/**
 * GET /api/creatives/[packageId]/download — returns a plain-text summary
 * (A full ZIP would require archiver on the server; this gives downloadable text)
 */
export async function POST(
  request: Request,
  { params }: { params: { packageId: string } }
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: pkg } = await supabase
    .from("weekly_packages")
    .select("week_start, creatives(*)")
    .eq("id", params.packageId)
    .single();

  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const creatives = [...((pkg.creatives as any[]) || [])].sort(
    (a, b) => a.day_index - b.day_index
  );

  let text = `CREATIVELOOP — Week of ${pkg.week_start}\n${"=".repeat(60)}\n\n`;

  for (const c of creatives) {
    text += `${DAY_NAMES[c.day_index].toUpperCase()} — ${c.post_type.toUpperCase()}\n`;
    text += `${"-".repeat(40)}\n`;
    text += `CAPTION:\n${c.caption}\n\n`;
    text += `HASHTAGS:\n${c.hashtags.map((h: string) => `#${h}`).join(" ")}\n\n`;
    text += `VIDEO SCRIPT:\n${c.video_script}\n\n`;
    if (c.image_url) text += `IMAGE URL:\n${c.image_url}\n\n`;
    text += "\n";
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="creativeloop-week-${pkg.week_start}.txt"`,
    },
  });
}
