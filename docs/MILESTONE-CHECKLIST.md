# Milestone Checklist

Run this checklist after completing each milestone (epic group) before moving to deployment or the next phase. Items are ordered by risk — fix blockers first, then warnings, then polish.

Based on [Supabase Vibe Coding Master Checklist](https://supabase.com/blog/the-vibe-coding-master-checklist), adapted for GoutWize.

---

## 1. Security Audit

### Authentication & Access Control (Magic Link)

Manual smoke test (no test framework needed):

1. Open an incognito window → go to `/feed` → should redirect to `/login`
2. Enter your email → click "Send Magic Link" → check your inbox
3. Click the magic link → should land on `/auth/callback` → redirect to `/onboarding` (new user) or `/feed` (existing user)
4. Complete onboarding → should redirect to `/feed`
5. Navigate to `/profile` → click "Sign out" → should redirect to `/`
6. Try visiting `/feed` again → should redirect to `/login`

> **Future E2E**: When adding Playwright, use `supabase start` locally which runs [Inbucket](http://localhost:54324) to capture emails. Extract the magic link from the Inbucket API and navigate to it programmatically.

- [ ] Smoke test: full login → onboarding → app → logout flow (steps 1-6 above)
- [ ] Verify middleware blocks unauthenticated access to `(app)/*` routes
- [ ] Verify incomplete profiles redirect to `/onboarding`
- [ ] Confirm magic link emails arrive within 30 seconds
- [ ] Test with an invalid/unregistered email — should still show "check your email" (no user enumeration)

### Row Level Security (RLS)

- [ ] Verify RLS is enabled on every table (`profiles`, `posts`, `comments`, `votes`, `checkins`, `flares`)
- [ ] Log in as User A, confirm you cannot see User B's checkins/flares/votes
- [ ] Confirm posts and comments are publicly readable
- [ ] Confirm only the author can update/delete their own posts and comments
- [ ] Test the `get_active_flare_count()` function is scoped to current user (not global)

### API & Secrets

- [ ] Run: `grep -r "supabase" --include="*.ts" --include="*.tsx" app/ lib/ | grep -v "createClient\|NEXT_PUBLIC"` — no leaked keys
- [ ] Confirm no secrets in client-side code (only `NEXT_PUBLIC_*` env vars in browser)
- [ ] Verify `/api/seed` route is disabled or removed before production deploy
- [ ] Check network tab in browser DevTools — no sensitive data in response payloads

### Input Validation

- [ ] Test all form inputs with empty values, special characters, and very long strings
- [ ] Verify post title/body, comment body, and username have reasonable length limits
- [ ] Confirm note fields handle edge cases (emoji, unicode, HTML tags)

---

## 2. Database & Data Integrity

### Schema Review

- [ ] Run `pnpm dlx prisma validate` — schema is valid
- [ ] Confirm all foreign keys have appropriate `onDelete` behavior (Cascade where needed)
- [ ] Verify `DEFAULT gen_random_uuid()` on all `id` columns at Postgres level
- [ ] Verify `DEFAULT now()` on all `created_at` and `updated_at` columns at Postgres level
- [ ] Check unique constraints exist: `votes(user_id, post_id)`, `votes(user_id, comment_id)`, `checkins(user_id, date)`

### Data Quality

- [ ] Query for orphaned records: comments without posts, votes without targets
- [ ] Verify `comment_count` on posts matches actual comment count
- [ ] Check `upvotes` counts are consistent with votes table

### Performance

- [ ] Review indexes on frequently queried columns (`author_id`, `post_id`, `user_id`, `created_at`)
- [ ] Test feed page load with 50+ posts — should stay under 1s
- [ ] Check for N+1 queries in pages that load related data

---

## 3. Error Handling & Resilience

### Error Boundaries

- [ ] `app/error.tsx` exists — catches unexpected runtime errors with a friendly UI
- [ ] `app/not-found.tsx` exists — custom 404 page
- [ ] `app/(app)/error.tsx` exists — catches errors within authenticated shell

### User-Facing Errors

- [ ] All form submissions show error messages on failure (not just console.error)
- [ ] Network failures show a retry prompt, not a blank screen
- [ ] Auth token expiry during a session redirects gracefully to login

### Logging

- [ ] No `console.log` statements in production code (only `console.error` in catch blocks)
- [ ] Run: `grep -rn "console.log" app/ lib/ components/ --include="*.ts" --include="*.tsx"` — should return nothing

---

## 4. Performance & UX

### Loading States

- [ ] `app/(app)/loading.tsx` exists — skeleton or spinner for authenticated routes
- [ ] All pages with data fetching show a loading indicator (not a blank screen)
- [ ] Buttons show disabled/spinner state during async operations

### Mobile & Responsiveness

- [ ] Test all pages at 375px width (iPhone SE)
- [ ] Test all pages at 390px width (iPhone 14)
- [ ] Test all pages at 768px width (iPad)
- [ ] Bottom nav doesn't overlap content
- [ ] Flare button doesn't cover important UI elements
- [ ] All tap targets are at least 44x44px

### Page Speed

- [ ] Run Lighthouse on landing page — target 90+ performance
- [ ] Images use Next.js `<Image>` with proper `width`/`height` or `fill`
- [ ] No oversized images served (target under 200KB per image)
- [ ] No layout shift (CLS) on page load

### Hydration

- [ ] No hydration mismatch warnings in browser console
- [ ] No `Math.random()` or `Date.now()` in render path (use `useEffect` for client-only values)

---

## 5. SEO & Meta Tags

### Basic SEO

- [ ] Root layout has `title` and `description` in metadata
- [ ] Landing page has Open Graph tags (`og:title`, `og:description`, `og:image`)
- [ ] Landing page has Twitter Card tags
- [ ] Each public page has a unique `<title>`

### Crawlability

- [ ] `app/sitemap.ts` exists and generates valid XML
- [ ] `app/robots.ts` exists — allows crawling of public pages, blocks `(app)/*`
- [ ] Canonical URLs are set on public pages

### Structured Data

- [ ] Landing page has Organization or WebSite JSON-LD schema (optional but recommended)

---

## 6. Deployment Readiness

### Environment

- [ ] `.env.example` documents all required variables
- [ ] No `.env` or `.env.local` committed to git: `git ls-files | grep "\.env"` — only `.env.example`
- [ ] Supabase Auth redirect URLs include the production domain + `/auth/callback`

### Build

- [ ] `pnpm run build` passes with zero errors
- [ ] `pnpm run lint` passes with zero errors
- [ ] No TypeScript `any` types added in this milestone (or justified with a comment)
- [ ] `package.json` version bumped appropriately (semver)

### Cleanup

- [ ] Remove or protect development-only routes (`/api/seed`)
- [ ] Remove unused imports and dead code
- [ ] No TODO/FIXME/HACK comments left unresolved

---

## 7. Quick Commands

Run these as a fast sanity check:

```bash
# Build + lint
pnpm run build && pnpm run lint

# Check for console.log
grep -rn "console.log" app/ lib/ components/ --include="*.ts" --include="*.tsx"

# Check for leaked secrets
grep -rn "sk_\|secret\|password\|apikey" app/ lib/ components/ --include="*.ts" --include="*.tsx" | grep -v node_modules

# Check for .env files in git
git ls-files | grep "\.env"

# Check for any types
grep -rn ": any" app/ lib/ components/ --include="*.ts" --include="*.tsx"

# Prisma schema validation
pnpm dlx prisma validate
```

---

## Scoring

After running the checklist, count items:

| Result | Meaning |
|--------|---------|
| All items pass | Ship it |
| 1-3 warnings (non-security) | Ship with follow-up tasks created |
| Any security item fails | Do not ship — fix first |
| 5+ items fail | Dedicate a hardening sprint before shipping |

---

## Current GoutWize Gaps (as of v0.17.2)

Known items to address before first production deploy:

| Gap | Section | Priority |
|-----|---------|----------|
| No `error.tsx` or `not-found.tsx` | Error Handling | High |
| No `loading.tsx` files | Performance & UX | High |
| No rate limiting on auth or API | Security | Medium |
| Minimal SEO (no OG tags, sitemap, robots.txt) | SEO | Medium |
| `get_active_flare_count()` may not be user-scoped | Security | Medium |
| No test framework configured | Build | Low (MVP) |
| `/api/seed` route accessible in production | Cleanup | High |
| `console.error` in form handlers (replace with error reporting) | Logging | Low |
