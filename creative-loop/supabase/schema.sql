-- CreativeLoop Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── businesses ──────────────────────────────────────────────────────────────
create table businesses (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  name            text not null,
  industry        text not null,
  tagline         text,
  tone            text not null check (tone in ('professional','playful','bold','inspirational','minimal')),
  brand_color_1   varchar(7) not null default '#4F46E5',
  brand_color_2   varchar(7) not null default '#7C3AED',
  target_audience text not null,
  platforms       text[] not null default '{"instagram"}',
  avoid_content   text,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

-- RLS: each user can only see their own business
alter table businesses enable row level security;
create policy "users see own business" on businesses
  for all using (auth.uid() = user_id);

-- ─── weekly_packages ─────────────────────────────────────────────────────────
create table weekly_packages (
  id           uuid primary key default uuid_generate_v4(),
  business_id  uuid references businesses(id) on delete cascade not null,
  week_start   date not null,
  status       text not null default 'generating' check (status in ('generating','ready','failed')),
  created_at   timestamptz not null default now(),
  unique(business_id, week_start)
);

alter table weekly_packages enable row level security;
create policy "users see own packages" on weekly_packages
  for all using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

-- ─── creatives ───────────────────────────────────────────────────────────────
create table creatives (
  id             uuid primary key default uuid_generate_v4(),
  package_id     uuid references weekly_packages(id) on delete cascade not null,
  day_index      integer not null check (day_index between 0 and 6),
  post_type      text not null,
  caption        text not null,
  hashtags       text[] not null default '{}',
  video_script   text not null,
  image_url      text,
  image_prompt   text,
  rating         integer check (rating between 1 and 5),
  feedback_notes text,
  created_at     timestamptz not null default now()
);

alter table creatives enable row level security;
create policy "users see own creatives" on creatives
  for all using (
    package_id in (
      select wp.id from weekly_packages wp
      join businesses b on b.id = wp.business_id
      where b.user_id = auth.uid()
    )
  );

-- ─── Supabase Storage bucket ─────────────────────────────────────────────────
-- Run this separately in the Supabase dashboard or via the API:
-- insert into storage.buckets (id, name, public) values ('creatives', 'creatives', true);
