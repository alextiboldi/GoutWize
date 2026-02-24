# GoutWise MVP — Build Plan

**Stack:** Next.js 15 (App Router) · Tailwind CSS · Supabase (Postgres + Auth + Realtime) · Vercel
**Goal:** Ship a working community app tonight — discussions, flare logging, daily check-ins, seeded insights

---

## Epic 0: Project Foundation

**What it's about:** Get the skeleton standing. Supabase project, Next.js app, auth wired up, deploy pipeline working. Nothing visible to users yet, but everything needed for the other epics to build on.

### Story 0.1 — Scaffold the project
Create the Next.js app with TypeScript and Tailwind. Install `@supabase/supabase-js` and `@supabase/ssr`. Set up environment variables for Supabase URL and anon key. Configure Tailwind with the app's color palette (near-black backgrounds, blue/green/red accents).

### Story 0.2 — Create Supabase project and schema
Create the Supabase project. Run the full SQL schema covering these tables:
- **profiles** — extends auth.users with username, gout_duration, flare_frequency, approach, reason
- **posts** — community discussions with title, body, category, upvotes, comment_count
- **comments** — replies on posts with optional tried_it field (worked/didn't/mixed)
- **votes** — tracks who voted on what (prevents double-voting)
- **checkins** — daily log: mood, hydration, alcohol, stress, note (one per user per day)
- **flares** — logged flares with joint, severity, status (active/improving/resolved), timestamps

Set up a trigger that auto-creates a profile row with a random username (e.g. "GoutWarrior_4821") whenever a new user signs up in auth. Set up a trigger that auto-increments post comment_count when a comment is inserted. Enable Row Level Security on all tables: profiles publicly readable, everything else scoped to the authenticated user except posts and comments which are publicly readable.

### Story 0.3 — Supabase auth configuration
Enable two auth providers in the Supabase dashboard: Google OAuth and Magic Link (email). Configure the redirect URL to point to your Vercel domain's `/auth/callback` route.

### Story 0.4 — Auth utilities and middleware
Create two Supabase client utilities: one for browser components (using `createBrowserClient`) and one for server components (using `createServerClient` with cookie handling). Create Next.js middleware that:
- Allows public access to `/`, `/login`, and `/auth/callback`
- Redirects unauthenticated users to `/login` for all other routes
- Redirects authenticated users whose profile has no `gout_duration` set to `/onboarding`
- Passes through everyone else normally

### Story 0.5 — Auth callback route
Create the `/auth/callback` route handler. It receives the auth code from OAuth/magic link, exchanges it for a session, and redirects to `/feed`. On error, redirects to `/login?error=auth_failed`.

### Story 0.6 — TypeScript types
Create a types file matching every database table. Also define constants: the 6 post categories with their labels and emoji, the 6 joint options for flares, and export the category/joint config so every part of the app uses the same data.

### Story 0.7 — Deploy pipeline
Push to GitHub, connect to Vercel, add environment variables. Deploy and confirm the empty app loads on your Vercel URL. Set the Vercel domain as an allowed redirect URL in Supabase Auth settings.

---

## Epic 1: Landing Page

**What it's about:** The first thing anyone sees. This page must communicate the value proposition in seconds, show social proof, differentiate from existing gout apps, and drive sign-ups. Mobile-first, single-column, dark theme. No authentication required.

### Story 1.1 — Build the landing page

The page is a single scrollable column, max-width ~448px (mobile-first), centered on larger screens. Dark background (#0c0c14). No navigation bar — just content flowing straight down.

Here is the exact layout, section by section:

---

#### SECTION 1: Hero
**Layout:** Centered text, generous top padding (~48px from top)

- **Icon:** 🤝 emoji, large (~48px)
- **Headline:** "You're not alone with gout."
  - Font: bold, ~30px, white, tight tracking
  - Line break after "alone"
- **Subtext:** "A community sharing what actually works. Real experiences. Real patterns. Real support."
  - Font: ~16px, muted color (#8899aa), regular weight
  - Three short sentences, line break between each

---

#### SECTION 2: Community Insights Preview (3 cards)
**Layout:** Small label above, then 3 stacked cards with slight gap between

- **Section label:** "COMMUNITY INSIGHTS" — uppercase, tiny (~11px), letter-spaced, blue (#2D9CDB), semibold
- **Card 1:**
  - Left: 😤 emoji
  - Right: **"68%"** in blue, bold, followed by "of gout sufferers report stress as a significant trigger — often more impactful than diet alone" in small muted text
- **Card 2:**
  - Left: 💧 emoji
  - Right: **"34%"** in blue, bold, followed by "fewer flares reported by members who actively track their hydration" in small muted text
- **Card 3:**
  - Left: 📅 emoji
  - Right: **"#1"** in blue, bold, followed by "Most common flare onset day: Monday. Weekend lifestyle changes may be a factor" in small muted text

Cards have a very subtle white background (white at ~4% opacity), rounded corners (~12px).

---

#### SECTION 3: Primary CTA Button
**Layout:** Full-width button, centered text below

- **Button text:** "Join the Community"
  - Blue background (#2D9CDB), white text, bold, ~18px
  - Rounded (~12px), generous padding (~16px vertical)
  - Hover: slightly darker blue
- **Below the button:** "Free. Anonymous by default. Your data stays private."
  - Tiny text (~12px), very muted (#556), centered

---

#### SECTION 4: Social Proof Numbers
**Layout:** 3-column grid, centered

- **Column 1:** "12K+" in bold blue (#2D9CDB), "Members" below in tiny muted text
- **Column 2:** "850+" in bold green (#27AE60), "Discussions" below in tiny muted text
- **Column 3:** "47" in bold orange (#F2994A), "Patterns found" below in tiny muted text

Note: These are aspirational/seeded numbers. They make the app feel alive. You'll replace them with real counts once the community grows.

---

#### SECTION 5: Value Proposition ("Not another food tracker")
**Layout:** Left-aligned text block, then 4 feature cards stacked

- **Heading:** "Not another food tracker."
  - Bold, ~18px, white
- **Body text:** "Every gout app tracks purines. None of them help you learn from thousands of others who share your condition. We're different."
  - ~14px, muted (#8899aa), relaxed line-height

Then 4 feature cards, each with:
- Left: emoji icon
- Right: bold title (~14px) + description (~12px, muted) below
- Very subtle background (white ~3% opacity), rounded

**Feature 1:**
- 📊 **"Pattern Intelligence"**
- "Discover triggers you never suspected, surfaced from real community data"

**Feature 2:**
- 💬 **"Ask the Community"**
- "Get answers from people who actually live with gout every day"

**Feature 3:**
- 🔥 **"Flare Support"**
- "One tap when you're in pain. Get crowdsourced relief tips and support instantly"

**Feature 4:**
- ✅ **"10-Second Check-in"**
- "Quick daily log that helps you and everyone else spot hidden patterns"

---

#### SECTION 6: Bottom CTA
**Layout:** Same as Section 3 but with different button text

- **Button text:** "Get Started — It's Free"
  - Same blue button style as above
- No text below this one — keep it clean at the end

**Bottom padding:** ~24px

---

### Story 1.2 — Seed insights data file
Create a data file with 10 hardcoded pattern insights. Each has an emoji icon, a stat (like "68%" or "3x"), a description, and a source label. These are displayed on the landing page and later on the feed. All should be grounded in real gout research or plausible community patterns:

1. 😤 "68%" — stress as a bigger trigger than diet (BMJ research)
2. 🍺 "3x" — beer vs wine/spirits flare risk (Lancet 2004)
3. 💧 "34%" — fewer flares with hydration tracking
4. 😴 "2.1x" — poor sleep correlation with flares
5. 🍒 "45%" — cherry juice mixed results
6. ✈️ "High" — air travel + dehydration combo
7. 🌡️ "22%" — humid climate correlation
8. 📅 "#1" — Monday as top flare day
9. ⚖️ "50%" — allopurinol under-dosing
10. 🥩 "Myth?" — strict red meat avoidance still leads to flares

Also create a relief tips array with 6 entries, each having an emoji, tip text, helpful percentage, and member count. These are shown after someone logs a flare.

---

## Epic 2: Authentication & Onboarding

**What it's about:** Get users signed up with minimal friction, then immediately collect the 4 profile data points that personalize their experience. The flow is: Landing → Login → Onboarding → Feed.

### Story 2.1 — Login page
A simple centered page with the app icon and "Join GoutWise" heading. Two auth options:
1. "Continue with Google" — white button with Google logo, triggers Supabase OAuth
2. "Send Magic Link" — email input field + submit button, triggers Supabase magic link

Below the email field: a "Check your email!" confirmation state that appears after submitting.
Footer text: "Anonymous by default. Your data stays private."

### Story 2.2 — Onboarding page (4 questions)
Full-screen flow with 4 sequential questions. Each question shows a prompt and chip-style answer options (rounded pill buttons). Tapping one selects it (highlight in blue) and you can proceed. Can be a single scrollable page or a multi-step stepper — whichever you find faster to build.

**Question 1:** "How long have you had gout?"
Options: New to it · 1–3 years · 3–10 years · 10+ years

**Question 2:** "How often do you flare?"
Options: Monthly · Every few months · Yearly · Unpredictable

**Question 3:** "What's your approach?"
Options: Strict diet · Medication · Both · Living freely & managing

**Question 4:** "What brought you here?"
Options: Want answers · Need support · Just diagnosed · Curious

On submit: update the user's profile row in Supabase, then redirect to `/feed`.

---

## Epic 3: App Shell & Navigation

**What it's about:** The persistent UI frame that wraps every authenticated page. Bottom tab bar for navigation, floating flare button always accessible.

### Story 3.1 — Authenticated layout
Create a layout wrapper for all authenticated pages (the route group under `(app)/`). It includes:
- A top-safe-area spacer (for mobile notch)
- The page content area (scrollable)
- The bottom navigation bar (fixed at bottom)
- The floating flare button

Background is the dark theme (#0c0c14). Max-width ~448px centered on desktop.

### Story 3.2 — Bottom navigation bar
Fixed at the bottom, 4 tabs in a row:
1. 🏠 **Feed** — links to `/feed`
2. ✏️ **Post** — links to `/post/new`
3. ✅ **Log** — links to `/checkin`
4. 👤 **Profile** — links to `/profile`

Active tab highlighted in blue. Inactive tabs in muted gray. Each tab has an icon and a small label below.

### Story 3.3 — Floating flare button
A prominent 🔥 button that floats above the bottom nav, centered. Red/orange gradient background with a subtle pulsing glow animation. Tapping it navigates to `/flare`. This button is ALWAYS visible on every authenticated page — it's the one action that must never be more than one tap away.

---

## Epic 4: Feed (Home Page)

**What it's about:** The main page users see after onboarding and every time they open the app. Mixes pattern insights, community discussions, and calls to action. This is the engagement engine.

### Story 4.1 — Feed page structure
The feed page at `/feed` contains these sections from top to bottom:

1. **Check-in nudge** (conditional) — if the user hasn't done their daily check-in yet, show a card at the top: "How are you today? Complete your 10-second check-in →" with a link to `/checkin`. Once completed for the day, this card disappears.

2. **Insight card** — show one random insight from the seed insights data, in a card with a colored left border. Rotates each time the page loads.

3. **Active flares banner** (conditional) — if there are any active flares in the database, show: "🔥 X members flaring right now. Send support →" This uses the `get_active_flare_count()` database function. Links to a filtered view or just shows the count.

4. **Discussion list** — all posts from the `posts` table, ordered by `created_at desc`. Each post shows as a PostCard (see next story).

### Story 4.2 — Post card component
A reusable card that displays a discussion post preview. Shows:
- Category badge (emoji + label, e.g. "🧪 Has anyone tried...?") in a small colored chip
- Post title (bold, ~15px)
- First ~100 characters of the body text (muted, truncated)
- Bottom row: author username · time ago · comment count ("💬 12") · upvote count ("👍 5")

Tapping the card navigates to `/post/[id]`.

---

## Epic 5: Discussions (Create & Read)

**What it's about:** The core community feature. Users create discussion posts in structured categories, others reply with comments that can include "tried it" badges. This is where 90% of daily engagement happens.

### Story 5.1 — Create post page
A form page at `/post/new` with:
1. **Category picker** — 6 horizontal scrollable chips:
   - 💬 General
   - 🧪 Has anyone tried...?
   - 🤔 Why do I...?
   - 🤷 What would you do?
   - 😤 Just venting
   - 💡 Tip / What worked
2. **Title input** — single line, placeholder depends on category (e.g. "Has anyone tried..." auto-fills for that category)
3. **Body textarea** — multi-line, placeholder: "Share your experience, question, or tip..."
4. **Submit button** — "Post to Community"

On submit: insert into `posts` table with author_id from auth session, redirect to the new post's detail page.

### Story 5.2 — Post detail page
At `/post/[id]`, shows:
- Full post (category badge, title, body, author, timestamp)
- Divider
- Comment list sorted by upvotes desc, then created_at desc
- Each comment shows: author username, "tried it" badge if present, body text, timestamp
- At the bottom: comment input form

### Story 5.3 — Comment form with tried-it badge
At the bottom of the post detail page, a form with:
1. **Optional "Tried it" selector** — three toggle chips: ✅ Worked · ❌ Didn't work · ⚠️ Mixed results. Tapping one selects it (can be deselected). This is optional — not every comment needs it.
2. **Comment text area** — placeholder: "Share your experience..."
3. **Submit button** — "Reply"

On submit: insert into `comments` with the post_id, author_id, body, and tried_it value (null if none selected). The trigger auto-increments the post's comment_count.

### Story 5.4 — Tried-it badge component
A small visual badge that appears on comments where the user indicated their experience:
- ✅ **Worked** — green background, shows "✅ Tried it: Worked"
- ❌ **Didn't work** — red/muted background, shows "❌ Tried it: Didn't work"
- ⚠️ **Mixed** — amber/yellow background, shows "⚠️ Tried it: Mixed results"

This is what makes discussions more valuable than Reddit — you can see at a glance how many people tried something and what their outcome was.

---

## Epic 6: Flare Flow

**What it's about:** The "emergency mode" of the app. When someone is in pain, they need minimum friction and maximum value. Log the flare in 2 taps, immediately see crowdsourced relief tips.

### Story 6.1 — Flare logging page
At `/flare`, a focused page with:
1. **Joint selector** — 6 large, easy-to-tap buttons in a grid/flex layout:
   🦶 Big toe (pre-selected as default) · 🦶 Ankle · 🦵 Knee · 🤚 Wrist · 🦶 Top of foot · 📍 Other
2. **Severity selector** — a row of 10 numbered circles (1–10). Large tap targets. Selected one fills red. Consider making these big enough to tap with shaky/painful hands.
3. **Submit button** — "Get Help Now →" in red (#EB5757)

On submit: insert into `flares` table with user_id, joint, severity, status='active'. Then show the relief tips section below (or navigate to a relief tips view).

### Story 6.2 — Relief tips display
Shown immediately after logging a flare. Displays the 6 hardcoded relief tips from the seed data. Each tip shows:
- Left: emoji icon
- Middle: tip text
- Right: "X% found helpful" with a small progress bar

At the bottom: "Want to talk about it? Start a discussion →" linking to `/post/new` with the "venting" category pre-selected.

Optional: a "Flare logged" confirmation message at the top with the severity and joint recorded.

---

## Epic 7: Daily Check-in

**What it's about:** The invisible data engine. A 10-second interaction that captures lifestyle signals. Must be absurdly fast to complete — if it takes more than 10 seconds, the completion rate drops dramatically.

### Story 7.1 — Check-in page
At `/checkin`, a single-screen form with:

1. **How are you feeling?** — 3 large emoji buttons in a row:
   😊 Good · 😐 Okay · 😣 Bad

2. **Hydration** — 3 chips:
   Low · OK · Good

3. **Alcohol yesterday?** — 3 chips:
   None · Light · Heavy

4. **Stress level** — 5 tappable circles numbered 1–5 (or small chips: Very low / Low / Medium / High / Very high)

5. **Note (optional)** — single-line text input, placeholder: "Anything unusual? Travel, bad sleep, new food..."

6. **Submit button** — "Done ✓" in green

On submit: upsert into `checkins` with user_id and today's date (so re-submitting the same day overwrites). Show a brief "Logged! ✓" confirmation then redirect to `/feed`.

### Story 7.2 — Check-in nudge on feed
On the feed page, query the `checkins` table for the current user + today's date. If no row exists, show a card at the top of the feed: "How are you today? Your 10-second check-in is ready →" linking to `/checkin`. If they've already completed it, don't show the card.

---

## Epic 8: Profile

**What it's about:** Basic user identity page. Minimal for MVP — just shows their info, lets them edit their username, and provides a sign-out button.

### Story 8.1 — Profile page
At `/profile`, shows:
- Username (editable inline or with an edit icon)
- Gout profile summary: duration, flare frequency, approach (from their onboarding answers)
- Stats: total flares logged, total check-ins completed, total comments posted (simple count queries)
- Sign out button at the bottom

---

## Epic 9: Seed Content

**What it's about:** Prevent the empty room problem. Before sharing the app with anyone, populate it with realistic discussion threads so new users land in a living community, not a ghost town.

### Story 9.1 — Seed discussion posts
Using the app yourself, create 8–10 discussion threads covering the most common gout questions. Use different categories. Here are the posts to create:

1. 🧪 **"Has anyone tried tart cherry juice? Does it actually work?"**
   Body: "I keep hearing about cherry juice for gout but I'm skeptical. My friend swears by it but I wonder if it's placebo. Has anyone here tried it consistently and seen a real difference?"

2. 🤔 **"Why do I flare even when I eat clean?"**
   Body: "I've been super strict with my diet for 3 weeks — no red meat, no alcohol, tons of water. Still got a flare in my big toe last night. What gives? Is diet even the main factor?"

3. 💬 **"I flare unpredictably every few months — anyone else?"**
   Body: "I can eat and drink whatever I want for 2-3 months with zero issues, then boom — flare out of nowhere. The randomness is almost worse than the pain because I never see it coming. Anyone relate?"

4. 🤷 **"My doctor wants me on allopurinol at 34 — what would you do?"**
   Body: "I'm 34 and flare about 3x per year. My rheumatologist recommends starting allopurinol but I'm nervous about being on daily medication for life at my age. Anyone been in this situation?"

5. 💡 **"Tip: Drinking water before bed has been a game changer for me"**
   Body: "I started forcing myself to drink a full glass of water right before sleep, and another one when I wake up at night. My overnight flares have basically stopped. It's been 4 months now. So simple but it made a huge difference."

6. 💬 **"Does weather actually affect your flares?"**
   Body: "I feel like I flare more when it rains or humidity is high. My doctor says there's no scientific evidence for this but my body says otherwise. Am I imagining things?"

7. 😤 **"Just need to vent — gout at 28 is embarrassing"**
   Body: "I'm 28 and people literally laugh when I tell them I have gout. They think it's an old man's disease. I'm in great shape, eat well, barely drink. It's genetic and I'm tired of explaining myself. Just needed to get that off my chest."

8. 🧪 **"Has anyone tried intermittent fasting for gout?"**
   Body: "Read some articles suggesting IF can help reduce uric acid levels. I'm considering trying 16:8 but worried that fasting itself might trigger flares. Anyone have experience with this?"

9. 💡 **"Tip: Track your stress, not just your food"**
   Body: "After a year of obsessively logging everything I ate and getting nowhere, I started tracking my stress levels instead. Turns out my worst flares all came after high-stress periods at work, regardless of what I ate. Changed my whole perspective."

10. 🤔 **"Why does my first flare of the year always happen in January?"**
    Body: "For the past 3 years, my first flare hits in January without fail. Holiday eating? Cold weather? New Year stress? I can't figure out the pattern. Anyone else notice seasonal trends?"

### Story 9.2 — Seed comments with tried-it badges
Go back into each post and add 2–3 realistic comments. At least half should use the tried-it badges. For example on the cherry juice post:

- Comment 1: ✅ Worked — "Been taking tart cherry extract capsules daily for 6 months. Went from flaring monthly to maybe once a quarter. Not a cure but noticeable improvement."
- Comment 2: ⚠️ Mixed — "Tried the juice for 3 months. Hard to tell if it helped or if other changes I made were the real factor. Tasted good though."
- Comment 3: ❌ Didn't work — "Tried both the juice and extract for a full year. Zero difference for me. Everyone's gout is different."

---

## Epic 10: Deploy & Test

**What it's about:** Get it live and verify the full flow works on mobile.

### Story 10.1 — Vercel deployment
Push to GitHub, connect to Vercel, add environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY). Deploy. Update Supabase Auth settings to include the Vercel domain as an allowed redirect URL (both the root domain and the /auth/callback path).

### Story 10.2 — End-to-end mobile test
On your phone, test the full flow:
1. Visit the landing page — does it look right on mobile?
2. Tap "Join the Community" → login page loads
3. Sign up with Google → redirected to onboarding
4. Complete 4 profile questions → redirected to feed
5. Feed shows insight card + seeded discussions
6. Tap a discussion → see detail + comments
7. Leave a comment with a tried-it badge
8. Create a new post
9. Tap 🔥 button → log a flare → see relief tips
10. Complete daily check-in → feed no longer shows nudge
11. Visit profile → see stats and sign out

---

## Build Order Summary

Do them in this exact order. Each builds on the previous.

| # | What | Estimated Time |
|---|------|---------------|
| 1 | Epic 0: Foundation (Supabase, Next.js, auth, middleware, types) | 45 min |
| 2 | Epic 1: Landing page | 30 min |
| 3 | Epic 2: Login + Onboarding | 25 min |
| 4 | Epic 3: App shell + bottom nav + flare button | 20 min |
| 5 | Epic 4: Feed page with insight card + post list | 25 min |
| 6 | Epic 5: Create post + post detail + comments | 35 min |
| 7 | Epic 6: Flare flow + relief tips | 20 min |
| 8 | Epic 7: Daily check-in + feed nudge | 15 min |
| 9 | Epic 8: Profile page | 10 min |
| 10 | Epic 9: Seed content (write posts + comments yourself) | 20 min |
| 11 | Epic 10: Deploy + test | 15 min |
| | **Total** | **~4.5 hours** |

---

## Day 2 Priorities (Tomorrow)

Once the MVP is live and you've shared it with a few people:

1. **Upvoting** — let users upvote posts and comments, sort by most helpful
2. **Real-time active flare counter** — Supabase Realtime subscription
3. **Post sorting/filtering** — by category, trending, newest, most discussed
4. **Check-in streak display** — show consecutive days on profile
5. **PWA manifest** — add to home screen capability
6. **Share/invite link** — easy way to invite friends with gout
7. **Basic notification** — email digest of popular discussions (Supabase Edge Function + Resend)
