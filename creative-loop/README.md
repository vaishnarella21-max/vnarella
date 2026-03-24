# CreativeLoop 🔁

**Automated weekly marketing creatives for small businesses.**

Businesses sign up once, fill out a 5-minute brand form, and every Monday they receive a full week of AI-generated social media content — images, captions, hashtags, and video scripts — delivered to their inbox and dashboard. No templates. No manual work. Fully automatic.

---

## Features

- **One-time onboarding** — 4-step form: business name, industry, tone, colors, audience, platforms
- **AI generation pipeline** — GPT-4o for text, DALL-E 3 for images, all brand-matched
- **Weekly scheduling** — Vercel Cron triggers generation every Monday at 7 AM
- **Email delivery** — Beautiful React Email sent via Resend with image previews
- **Dashboard portal** — View, download, and rate creatives
- **Feedback loop** — Star ratings + notes feed into the next week's generation prompt
- **7 post types per week** — educational, promotional, behind-the-scenes, motivational, and more

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI – Text | OpenAI GPT-4o |
| AI – Images | DALL-E 3 |
| Email | Resend + React Email |
| Scheduling | Vercel Cron Jobs |
| Hosting | Vercel |

---

## Setup

### 1. Clone & install

```bash
git clone https://github.com/your-username/creative-loop
cd creative-loop
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor
3. Create a storage bucket called `creatives` (public)

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
CRON_SECRET=any-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

```
User signs up
    ↓
Fills brand onboarding form (5 min, once)
    ↓
POST /api/generate triggered immediately
    ↓
GPT-4o generates 7 captions + hashtags + video scripts (1 API call)
    ↓
DALL-E 3 generates 7 images (7 parallel calls)
    ↓
Images uploaded to Supabase Storage
    ↓
Creatives saved to DB → package marked "ready"
    ↓
Resend sends email with 3 image previews + dashboard link
    ↓
Every Monday: Vercel Cron → /api/cron/weekly → repeats for all active businesses
    ↓
Business rates creatives (1-5 ★) → feedback stored
    ↓
Next week's prompt includes feedback summary
```

---

## Project Structure

```
app/
├── page.tsx                    ← Landing page
├── (auth)/login|signup/        ← Auth pages
├── onboarding/                 ← 4-step brand form
├── (dashboard)/                ← Protected routes
│   ├── page.tsx                ← This week's creatives
│   └── history/                ← Past packages
└── api/
    ├── onboarding/             ← Save brand profile
    ├── generate/               ← Run AI pipeline
    ├── creatives/              ← Fetch + download
    ├── feedback/               ← Submit ratings
    └── cron/weekly/            ← Monday automation

lib/
├── supabase/                   ← DB client + types
└── openai/generate.ts          ← Full AI pipeline

emails/WeeklyCreatives.tsx      ← React Email template
supabase/schema.sql             ← Database schema
```

---

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. The cron job in `vercel.json` runs automatically every Monday at 7 AM UTC

---

## Portfolio Notes

**What this demonstrates:**
- End-to-end full-stack development
- Multi-modal AI integration (text + image generation)
- Prompt engineering with dynamic context and feedback loops
- Production scheduling patterns (Vercel Cron)
- Transactional email with React Email
- Real-time UI updates (polling for generation status)
- Row-level security (Supabase RLS)

---

Built with ❤️ · Next.js · OpenAI · Supabase · Resend
