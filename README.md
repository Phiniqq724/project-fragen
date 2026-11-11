# Fragen

Lessons for our Deutsch class. A teacher uploads single-file HTML lessons; students open them by link on any phone or laptop, without downloading anything.

- Student pages: `/en`, `/de`, `/id` (language picked from the last choice, then the browser, then English). Shared lesson links look like `/l/<slug>` and open in each student's language.
- Teacher panel: `/login` → `/admin` (upload with live preview, edit, hide, replace file, delete).
- Lesson files run in a sandbox (`/raw/<slug>`), so they cannot touch the site or a teacher's session.

Stack: Next.js 16 (App Router, Cache Components), Supabase (Postgres, Storage, Auth), Tailwind CSS 4, Fontshare fonts. Design rules live in `DESIGN.md`.

## Setup

1. Create a Supabase project and run `supabase/migrations/0001_init.sql` in its SQL editor.
2. In Supabase, **Authentication → Sign In / Providers**: turn off "Allow new users to sign up".
3. **Authentication → Users → Add user** for each teacher (tick "Auto confirm").
4. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key (Project settings → API).
5. `bun install` and `bun run dev`.

## Deploy (Vercel)

Import the repository, add the two environment variables from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`), and deploy. If you add a custom domain, also set `NEXT_PUBLIC_SITE_URL` so canonical links, the sitemap and share images use it.

## SEO

Per-language titles and descriptions, canonical + hreflang links, Open Graph / Twitter cards (a generated share image per lesson, so links pasted in chat groups show the lesson title), JSON-LD (`WebSite`, `LearningResource`, `BreadcrumbList`), `sitemap.xml`, `robots.txt` (teacher pages excluded) and a web manifest. Raw lesson files send `X-Robots-Tag: noindex`.
