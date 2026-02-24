# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoutWize is a community health app for gout management built with Next.js (App Router), Tailwind CSS, Supabase (Postgres + Auth + Realtime), and deployed on Vercel. The MVP includes discussions, flare logging, daily check-ins, and seeded insights.

## Commands

```bash
pnpm run dev      # Start dev server (http://localhost:3000)
pnpm run build    # Production build
pnpm run start    # Serve production build
pnpm run lint     # ESLint (v9 flat config with Next.js Core Web Vitals + TypeScript rules)
```

Package manager is **pnpm**. No test framework is configured yet.

## Tech Stack

- **Next.js 16** (App Router) with React 19 and TypeScript 5.9 (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — uses modern `@import "tailwindcss"` syntax and `@theme inline` blocks
- **Supabase** for Postgres DB, Auth (Google OAuth + Magic Link), and Realtime
- **Vercel** for deployment
- **Tailwind CSS v4** (using `@tailwindcss/postcss` plugin, `@import "tailwindcss"` syntax)
- **pnpm** as package manager
- **ESLint 9** flat config with `eslint-config-next` (core-web-vitals + typescript)
- **Tanstack Query** for data fetching and state management
- **Tanstack Table** for data tables
- **Tanstack Form** for form management
- **Zustand** for global state management
- **Shadcn UI** for UI components
- **Lucide React** for icons
- **Radix UI** for unstyled, accessible components
- **Framer Motion** for animations
- **Prisma 7** with PostgreSQL (client output in `generated/prisma/`)
- **Zod** for schema validation
- **clsx** + **tailwind-merge** for CSS class merging
- **Release Please** for release management
- **Semantic Versioning** for versioning


## Architecture

- `app/` — Next.js App Router pages and layouts. Server components by default.
- `app/globals.css` — Tailwind v4 config with CSS custom properties for theming (light/dark via `prefers-color-scheme`)
- `docs/plans/goutwize-mvp-plan.md` — Detailed MVP specification with 10 epics, database schema, design system, and build order. **Read this before implementing features.**

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

### Planned Structure (from MVP plan)

The app uses route groups: public routes (`/`, `/login`, `/auth/callback`) and authenticated routes under an `(app)/` group with a shared layout (bottom nav bar + floating flare button). Middleware enforces auth and redirects incomplete profiles to `/onboarding`.

### Database Tables

`profiles`, `posts`, `comments`, `votes`, `checkins`, `flares` — all with Row Level Security. Two Supabase clients needed: `createBrowserClient` for client components, `createServerClient` with cookie handling for server components.

### Design System

- Dark theme: `#0c0c14` background
- Accent colors: blue `#2D9CDB`, green `#27AE60`, orange `#F2994A`, red `#EB5757`
- Mobile-first, max-width ~448px centered on desktop
- Emoji-heavy UI for categories, joints, badges

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```
