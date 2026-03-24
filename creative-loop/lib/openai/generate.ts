import OpenAI from "openai";
import { Business, Creative } from "@/lib/supabase/types";
import { format, startOfWeek, addDays } from "date-fns";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const POST_TYPES = [
  "educational",
  "promotional",
  "behind-the-scenes",
  "motivational",
  "testimonial",
  "product-spotlight",
  "community",
];

interface FeedbackSummary {
  avgRating: number | null;
  notes: string[];
}

interface GeneratedPost {
  day_index: number;
  post_type: string;
  caption: string;
  hashtags: string[];
  video_script: string;
  image_prompt: string;
}

// ── Build the system prompt from business context ─────────────────────────────
function buildSystemPrompt(business: Business, feedback: FeedbackSummary): string {
  const platformList = business.platforms.join(", ");
  const weekLabel = format(new Date(), "'week of' MMMM d, yyyy");

  let feedbackSection = "";
  if (feedback.avgRating !== null) {
    if (feedback.avgRating < 3) {
      feedbackSection = `
FEEDBACK FROM LAST WEEK (avg ${feedback.avgRating}/5 — needs improvement):
The business found last week's content underwhelming. Change the direction significantly.
Specific notes: ${feedback.notes.join("; ") || "none"}
`;
    } else if (feedback.avgRating >= 4) {
      feedbackSection = `
FEEDBACK FROM LAST WEEK (avg ${feedback.avgRating}/5 — great!):
The business loved last week's style. Stay close to the same approach.
Specific notes: ${feedback.notes.join("; ") || "none"}
`;
    } else {
      feedbackSection = `
FEEDBACK FROM LAST WEEK (avg ${feedback.avgRating}/5 — okay):
Specific notes: ${feedback.notes.join("; ") || "none"}
`;
    }
  }

  return `You are a professional social media marketing expert creating content for the ${weekLabel}.

BUSINESS PROFILE:
- Name: ${business.name}
- Industry: ${business.industry}
- Tagline: ${business.tagline || "none"}
- Tone of voice: ${business.tone}
- Target audience: ${business.target_audience}
- Platforms: ${platformList}
- Brand colors: ${business.brand_color_1} and ${business.brand_color_2}
- Content to avoid: ${business.avoid_content || "nothing specific"}
${feedbackSection}

TASK: Generate exactly 7 social media posts for Monday through Sunday.
Each post must have a different content type from this list: ${POST_TYPES.join(", ")}.
Vary the types across the week for maximum engagement.

OUTPUT FORMAT: Respond with a valid JSON array of exactly 7 objects, each with:
{
  "day_index": 0-6 (0=Monday, 6=Sunday),
  "post_type": one of the types above,
  "caption": full caption text optimized for ${platformList} (include line breaks with \\n),
  "hashtags": array of 15-20 strings WITHOUT the # symbol,
  "video_script": a 30-60 second script in the format "HOOK: ... | CONTENT: ... | CTA: ...",
  "image_prompt": a detailed DALL-E 3 prompt for a ${platformList}-optimized image that uses ${business.brand_color_1} and ${business.brand_color_2} as the dominant color palette. Do NOT include text in the image.
}

Important:
- Match the tone strictly: ${business.tone}
- Captions should feel human and natural, not robotic
- Hashtags should mix high-volume (#marketing) and niche-specific tags
- Video scripts should have a strong hook in the first 3 seconds
- Image prompts should describe visual compositions, not just concepts
- Respond with ONLY the JSON array, no other text`;
}

// ── Generate text (captions, hashtags, scripts) ───────────────────────────────
async function generateText(
  business: Business,
  feedback: FeedbackSummary
): Promise<GeneratedPost[]> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'You are a marketing expert. Always respond with valid JSON containing a "posts" array.',
      },
      {
        role: "user",
        content: buildSystemPrompt(business, feedback),
      },
    ],
    temperature: 0.8,
    max_tokens: 4000,
  });

  const content = completion.choices[0].message.content || "{}";
  const parsed = JSON.parse(content);

  // Support both {posts: [...]} and [...] response shapes
  const posts: GeneratedPost[] = Array.isArray(parsed) ? parsed : parsed.posts;

  if (!Array.isArray(posts) || posts.length !== 7) {
    throw new Error(
      `Expected 7 posts, got ${Array.isArray(posts) ? posts.length : "non-array"}`
    );
  }
  return posts;
}

// ── Generate a single image via DALL-E 3 ─────────────────────────────────────
async function generateImage(prompt: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    response_format: "url",
  });
  return response.data[0].url!;
}

// ── Download image to buffer (for uploading to Supabase Storage) ──────────────
async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// ── Main: generate a full week for one business ───────────────────────────────
export async function generateWeeklyPackage(
  business: Business,
  packageId: string,
  supabase: ReturnType<typeof import("@/lib/supabase/server").createServiceClient>,
  feedback: FeedbackSummary = { avgRating: null, notes: [] }
): Promise<Omit<Creative, "id" | "created_at">[]> {
  // 1. Generate all text content in one GPT-4o call
  const posts = await generateText(business, feedback);

  // 2. For each post, generate an image (with graceful fallback)
  const creatives: Omit<Creative, "id" | "created_at">[] = [];

  for (const post of posts) {
    let imageUrl: string | null = null;

    try {
      const dalleUrl = await generateImage(post.image_prompt);
      const imageBuffer = await downloadImage(dalleUrl);

      // Upload to Supabase Storage
      const filename = `${business.id}/${packageId}/day-${post.day_index}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("creatives")
        .upload(filename, imageBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrl } = supabase.storage
          .from("creatives")
          .getPublicUrl(filename);
        imageUrl = publicUrl.publicUrl;
      }
    } catch (err) {
      console.error(`Image generation failed for day ${post.day_index}:`, err);
      // Continue without image — dashboard shows placeholder
    }

    creatives.push({
      package_id: packageId,
      day_index: post.day_index,
      post_type: post.post_type,
      caption: post.caption,
      hashtags: post.hashtags,
      video_script: post.video_script,
      image_url: imageUrl,
      image_prompt: post.image_prompt,
      rating: null,
      feedback_notes: null,
    });
  }

  return creatives;
}

// ── Get feedback summary for a business (last 4 weeks) ───────────────────────
export async function getFeedbackSummary(
  businessId: string,
  supabase: ReturnType<typeof import("@/lib/supabase/server").createServiceClient>
): Promise<FeedbackSummary> {
  const { data } = await supabase
    .from("weekly_packages")
    .select("creatives(rating, feedback_notes)")
    .eq("business_id", businessId)
    .eq("status", "ready")
    .order("created_at", { ascending: false })
    .limit(4);

  if (!data?.length) return { avgRating: null, notes: [] };

  const allCreatives = data.flatMap((p: any) => p.creatives || []);
  const rated = allCreatives.filter((c: any) => c.rating !== null);
  const avgRating =
    rated.length > 0
      ? rated.reduce((sum: number, c: any) => sum + c.rating, 0) / rated.length
      : null;

  const notes = allCreatives
    .filter((c: any) => c.feedback_notes)
    .map((c: any) => c.feedback_notes as string)
    .slice(0, 5);

  return { avgRating, notes };
}
