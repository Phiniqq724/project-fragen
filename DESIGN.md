# Fragen design direction: Pop Quiz

Chosen by the owner from three previewed directions. Light mode only. Single source of truth for every page.

## Read

Classroom tool for one German class. Students open lessons on phones; one or two teachers manage them. It should feel like a fun quiz sheet covered in stickers, not a regular website. The lesson HTML stays the star on the viewer page.

Dial: ENERGY 3 / RHYTHM 2 / MOTION 1

## Identity

- **Logo**: `<Wordmark />`, "Fragen" + a tilted tomato "?" sticker (Fragen = questions). Approved by owner.
- **Sticker motif**: things the user interacts with are stickers: 2.5px ink outline, 16px radius, hard offset ink shadow (`sticker` utility, `shadow-hard*`). Buttons press flat into the page when tapped.
- **Sticker word**: one word in each page headline sits in a tilted sticker with a tomato shadow (`sticker-word` utility). Once per screen.
- **Playful rhythm**: lesson rows alternate surface / sky / pink fills with a tiny tilt (0.6deg / -0.5deg). Never more than 1deg.
- **Pattern**: `<GridBackdrop />` (faint grid on sun yellow, sharp in the centre, blurred toward every edge). ONLY on list pages: the student lesson list and the admin lesson list. NOT on the lesson viewer, login, upload/edit forms, error or not-found pages; those use plain `bg-paper`.

## Tokens (`app/globals.css`, Tailwind names)

| Tailwind | Value | Use |
|---|---|---|
| `bg-sun` | #ffe066 | list-page background (via GridBackdrop), date badges |
| `bg-paper` | #fff8d6 | plain pages |
| `bg-surface` | #fffdf5 | stickers, inputs |
| `text-ink` / `border-ink` | #201a0f | text, outlines, hard shadows |
| `text-ink-muted` | #5a5040 | secondary text (6:1+ on every fill) |
| `bg-accent` | #c93a22 | tomato: primary buttons, topic tags (white text 5.1:1) |
| `bg-sky`, `bg-pink`, `bg-mint` | pastels | alternating sticker fills, hover on secondary controls |
| `text-danger`, `bg-danger-soft` | | destructive actions and errors only |
| `bg-success-soft` | | saved / published confirmations |
| `border-line` | #e9dfbd | soft dividers inside a sticker only |

## Type (Fontshare only, loaded in `app/layout.tsx`)

- Display: **Cabinet Grotesk** 800/700 (`font-display`). Headlines, lesson titles, logo.
- Text: **Switzer** 400-700 (`font-sans`, default). Body, buttons, forms.
- Page title `font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-[0.98]`; sticker title `font-display text-xl font-bold`; body `text-base`; meta `text-sm text-ink-muted`.
- No uppercase tracked labels. No em dashes in any copy.

## Shape & space

- Radius: buttons/inputs 12px, stickers 16px, chips/tags full.
- Page gutter `px-4 sm:px-6`; lists/forms `max-w-3xl`, viewer `max-w-6xl`.
- Lists: a stack of stickers with `gap-4` (not divider rows).
- Touch targets at least 44px.

## Motion

Hover lift (-1px) and press-flat on stickers/buttons, logo "?" wiggles on hover, 150-200ms `--ease-out`. Respect reduced motion. No entrance animations.

## Copy

English UI. Headline sticker words may be short German (e.g. "Heute *lernen* wir.") since it's a German class. Plain verb + object buttons. No buzzwords, no fake numbers.

## Components (`components/ui`)

`Button` / `ButtonLink` (primary, secondary, ghost, danger), `Field`, `Input`, `Textarea`, `TopicChip` (tomato tag), `TopicChipButton` (filter), `Wordmark`, `Notice` (sticker), `LessonFrame` (sticker frame), `GridBackdrop`. Utilities: `sticker`, `sticker-word`, `shadow-hard-sm|hard|hard-lg|hard-accent`.
