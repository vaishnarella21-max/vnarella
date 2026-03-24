import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { creativeId, rating, notes } = await request.json();

  if (!creativeId || rating === undefined) {
    return NextResponse.json({ error: "creativeId and rating required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
  }

  // RLS will ensure the user owns this creative
  const { error } = await supabase
    .from("creatives")
    .update({ rating, feedback_notes: notes || null })
    .eq("id", creativeId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
