# Articles Feature Design

**Date:** 2026-03-06
**Status:** Approved

## Overview

Bot-authored SEO content pushed via API. Publicly accessible without login. Separate from community posts.

## Data Model

New `Article` Prisma model:

```prisma
model Article {
  id              String   @id @default(uuid()) @db.Uuid
  slug            String   @unique
  title           String
  body            String
  excerpt         String
  category        String
  imageUrl        String?  @map("image_url")
  tags            String[] @default([])
  readTime        Int      @map("read_time")       // minutes
  metaDescription String   @map("meta_description")
  publishedAt     DateTime @default(now()) @map("published_at")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("articles")
}
```

No author relation — all articles come from the bot. Tags as Postgres text array. `publishedAt` separate from `createdAt` for future scheduling support.

## API Route

`app/api/bot/article/route.ts` — mirrors existing bot post pattern:

- **Auth:** `x-api-key` header validated against `BOT_API_KEY` env var
- **Method:** POST
- **Body:** `{ title, slug, body, excerpt, category, image_url?, tags[], read_time, meta_description }`
- **Validation:** Zod schema, checks slug uniqueness, auto-generates slug from title if not provided
- **Response:** `201` with `{ id, slug, title, published_at }`

## Public Pages

### `/articles` — Listing

- Server component, articles ordered by `published_at` desc
- Card grid: hero image, title, excerpt, category badge, read time, date
- Category filter via query params (`/articles?category=nutrition`)
- Responsive: single column mobile, 2-3 columns desktop
- Landing page design language: full-width, `max-w-7xl`
- Header with nav links (How It Works, Features, Community, Articles) + CTA to join

### `/articles/[slug]` — Detail

- Server component fetching by slug
- Hero image, title, category badge, read time, published date
- Body via existing `MarkdownContent` component (full variant)
- `<head>` meta tags: `og:title`, `og:description`, `og:image`, `twitter:card`
- CTA banner at bottom nudging readers to join GoutWize

## Routing & Navigation

- Add `/articles` to middleware public routes
- Add "Articles" nav link to landing page header (alongside How It Works, Features, Community)
- Wire up landing page footer "Blog" placeholder to `/articles`
