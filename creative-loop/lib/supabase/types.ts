export type Tone = "professional" | "playful" | "bold" | "inspirational" | "minimal";
export type Platform = "instagram" | "facebook" | "linkedin" | "tiktok";
export type PackageStatus = "generating" | "ready" | "failed";

export interface Business {
  id: string;
  user_id: string;
  name: string;
  industry: string;
  tagline: string | null;
  tone: Tone;
  brand_color_1: string;
  brand_color_2: string;
  target_audience: string;
  platforms: Platform[];
  avoid_content: string | null;
  active: boolean;
  created_at: string;
}

export interface WeeklyPackage {
  id: string;
  business_id: string;
  week_start: string; // ISO date string
  status: PackageStatus;
  created_at: string;
  creatives?: Creative[];
}

export interface Creative {
  id: string;
  package_id: string;
  day_index: number; // 0=Mon, 6=Sun
  post_type: string;
  caption: string;
  hashtags: string[];
  video_script: string;
  image_url: string | null;
  image_prompt: string | null;
  rating: number | null;
  feedback_notes: string | null;
  created_at: string;
}

export const DAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;
export const TONES: { value: Tone; label: string; description: string }[] = [
  { value: "professional", label: "Professional",   description: "Polished, authoritative, trust-building" },
  { value: "playful",      label: "Playful",        description: "Fun, energetic, personality-driven" },
  { value: "bold",         label: "Bold",           description: "Confident, direct, impact-first" },
  { value: "inspirational",label: "Inspirational",  description: "Motivating, uplifting, story-driven" },
  { value: "minimal",      label: "Minimal",        description: "Clean, simple, let the work speak" },
];
export const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "facebook",  label: "Facebook",  icon: "👥" },
  { value: "linkedin",  label: "LinkedIn",  icon: "💼" },
  { value: "tiktok",    label: "TikTok",    icon: "🎵" },
];
