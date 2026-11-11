# Fragen

Live at **https://fragen.sndyy.id**. Lessons for our Deutsch class. A teacher uploads single-file HTML lessons; students open them by link on any phone or laptop, without downloading anything.

- Student pages: `/de`, `/en`, `/id`. First visits start in German; the switcher choice is remembered.
- Share links are short: `fragen.sndyy.id/k3x9q` (5-character code per lesson). They open the full lesson page (`/de/l/<slug>`) in each student's language.
- Teacher panel: `/login` → `/admin` (upload with live preview, edit, hide, replace file, delete).
- Lesson files run in a sandbox (`/raw/<slug>`), so they cannot touch the site or a teacher's session.

Stack: Next.js 16 (App Router, Cache Components), Supabase (Postgres, Storage, Auth), Tailwind CSS 4, Fontshare fonts. Design rules live in `DESIGN.md`.

## Setup

1. Create a Supabase project and run every file in `supabase/migrations/` in order (0001, 0002, 0003) in its SQL editor.
2. In Supabase, **Authentication → Sign In / Providers**: turn off "Allow new users to sign up".
3. **Authentication → Users → Add user** for each teacher (tick "Auto confirm").
4. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key (Project settings → API).
5. `bun install` and `bun run dev`.

## Deploy (Vercel)

Import the repository, add the two environment variables from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), and deploy. Add `fragen.sndyy.id` under Vercel → Settings → Domains. Canonical links, the sitemap and share images already point there; `NEXT_PUBLIC_SITE_URL` can override it.

## SEO

Per-language titles and descriptions, canonical + hreflang links, Open Graph / Twitter cards (a generated share image per lesson, so links pasted in chat groups show the lesson title), JSON-LD (`WebSite`, `LearningResource`, `BreadcrumbList`), `sitemap.xml`, `robots.txt` (teacher pages excluded) and a web manifest. Raw lesson files send `X-Robots-Tag: noindex`.
