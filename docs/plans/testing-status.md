# Testing Status — GoutWize

**Branch**: `feat/tests`
**Date**: 2026-02-26
**Base version**: v0.45.0

## Current State

### Unit & Component Tests (Vitest) — PASSING

**70 tests across 10 files**, all green. Run with `pnpm test`.

| File | Tests | Status |
|------|-------|--------|
| `__tests__/lib/utils.test.ts` | 11 | Passing |
| `__tests__/lib/constants.test.ts` | 16 | Passing |
| `__tests__/lib/seed-data.test.ts` | 8 | Passing |
| `__tests__/lib/toast-store.test.ts` | 5 | Passing |
| `__tests__/components/tried-it-badge.test.tsx` | 4 | Passing |
| `__tests__/components/toast-container.test.tsx` | 3 | Passing |
| `__tests__/components/post-card.test.tsx` | 7 | Passing |
| `__tests__/components/install-prompt.test.tsx` | 6 | Passing |
| `__tests__/components/bottom-nav.test.tsx` | 4 | Passing |
| `__tests__/components/upvote-button.test.tsx` | 6 | Passing |

### E2E Tests (Playwright) — PUBLIC PASSING, AUTH PENDING

**22 public tests passing** across 5 spec files. Run with `pnpm test:e2e --project=public`.

| Spec | Tests | Status |
|------|-------|--------|
| `e2e/landing.spec.ts` | 5 | Passing |
| `e2e/auth.spec.ts` | 3 | Passing |
| `e2e/middleware.spec.ts` | 8 | Passing |
| `e2e/pwa.spec.ts` | 4 | Passing |
| `e2e/post-public.spec.ts` | 2 | Passing |

**Authenticated tests not yet runnable** — require local Supabase with Inbucket:

| Spec | Tests | Status |
|------|-------|--------|
| `e2e/feed.spec.ts` | 7 | Pending (needs auth) |
| `e2e/post.spec.ts` | 4 | Pending (needs auth) |
| `e2e/flare.spec.ts` | 4 | Pending (needs auth) |
| `e2e/checkin.spec.ts` | 3 | Pending (needs auth) |
| `e2e/profile.spec.ts` | 5 | Pending (needs auth) |

## What's Left

### 1. Run authenticated E2E tests

The auth setup (`e2e/auth.setup.ts`) uses Inbucket to capture Supabase magic link emails locally. To run:

```bash
supabase start                          # starts local Supabase + Inbucket
pnpm test:e2e                           # runs all tests (public + auth)
pnpm test:e2e --project=chromium        # runs only desktop auth tests
pnpm test:e2e --project=mobile          # runs only mobile auth tests
```

Inbucket runs at `http://localhost:54324`. The auth setup:
1. Submits `e2e-test@goutwize.local` on the login page
2. Polls Inbucket API for the magic link email
3. Navigates to the magic link to complete authentication
4. Saves session state to `e2e/.auth/user.json`

### 2. Fix authenticated test selectors (likely)

The authenticated tests (feed, post, flare, checkin, profile) were written against the plan spec and may need selector adjustments once they can actually run against the live app — similar to how the public tests needed fixes for actual page content vs planned content.

### 3. Onboarding redirect handling

The middleware redirects authenticated users without a completed profile to `/onboarding`. The E2E test user will need to have completed onboarding, or the tests need to handle the onboarding flow first.

## Architecture Decisions

### Playwright project structure

The config splits tests into 3 independent projects to avoid auth blocking public tests:

```
public     — no auth, runs independently (landing, auth, middleware, pwa, post-public)
setup      — authenticates via Inbucket magic link, saves state
chromium   — authenticated desktop tests, depends on setup
mobile     — authenticated mobile tests, depends on setup
```

### RTL cleanup

`vitest.setup.ts` includes explicit `cleanup()` in `afterEach` because without `globals: true` in the vitest config, RTL can't auto-hook into the test lifecycle.

## Commands Reference

```bash
pnpm test                   # Run all Vitest tests (unit + component)
pnpm test:watch             # Run Vitest in watch mode
pnpm test:e2e               # Run all Playwright tests
pnpm test:e2e --project=public  # Run only public (no-auth) tests
pnpm test:e2e:ui            # Open Playwright UI mode
```
