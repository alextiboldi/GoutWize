# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoutWize is a community health app for gout management built with Next.js (App Router), Tailwind CSS, Supabase (Postgres + Auth + Realtime), and deployed on Vercel. The MVP includes discussions, flare logging, daily check-ins, and seeded insights.


Package manager is **pnpm**. No test framework is configured yet.

## Tech Stack

- **Next.js 16** (App Router) with React 19 and TypeScript 5.9 (strict mode)
- **Tailwind CSS v4** via `@tailwindcss/postcss` — uses modern `@import "tailwindcss"` syntax and `@theme inline` blocks
- **Supabase** for Postgres DB, Auth (Magic Link only), and Realtime
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
- `docs/plans/goutwize-day2-plan.md` — Detailed specification for day 2 of the MVP. **Read this before implementing features.**
- `docs/DESIGN-SYSTEM.md` — Design system for the app. **Read this before implementing features.**

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`).

### Git Commits
- Use conventional commit messages (`feat:`, `fix:`, `chore:`, etc.)
- Do NOT manually bump `package.json` version — Release Please handles versioning automatically on merge to main


### General
- if a nodejs package is missing, NEVER install it yourself! ALWAYS ask me to install it for you by giving me the command to run