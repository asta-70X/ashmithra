# Ashmithra

Responsive Next.js and Tailwind starter based on the Ashmithra Figma home design. It includes the home dashboard, question entry, crop photo intake, sample weather and advisory, saved questions, and help pages.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install` and `npm run dev`.
3. Open `http://localhost:3000`.

Without Supabase credentials, question entries and saved answers stay in this browser's local storage. They are not synced between devices.

## Connect Supabase

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase project API settings.
2. In Supabase Auth, enable anonymous sign-ins.
3. Run `supabase/migrations/202611140001_initial_schema.sql` in the Supabase SQL editor.

Question writes and private crop photo uploads use a per-device anonymous auth account and row level security. Question replies use a built-in guide that adapts first checks to the symptom, crop, and growth stage. Location is used to direct farmers to a relevant local advisory source, but the app does not fetch live local weather or advisories. Replies are not AI-generated, do not diagnose crops, and do not recommend chemical dosages. A connected language model and curated regional data source would be needed for open-ended, fully localized generated answers. Never put a service role key in a `NEXT_PUBLIC_` variable. The weather values are illustrative and are not connected to a live forecast provider.
