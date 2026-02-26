# GoutWise Day 2 — Build Plan

**Context:** MVP is live. Users can sign up, post discussions, comment with tried-it badges, log flares, and do daily check-ins. The feed shows hardcoded insights and seeded content. Day 2 is about making the app sticky, social, and starting to replace faked data with real signals.

**Day 2 Theme: Make it feel alive.**

---

## Epic 11: Upvoting

**What it's about:** Without upvoting, every post and comment has equal weight. The community can't signal what's useful versus what's noise. This is the single most important day-2 feature because it transforms a flat list of posts into a ranked, curated knowledge base. It also makes commenting more rewarding — your helpful reply gets recognized.

### Story 11.1 — Upvote button on posts
Add a small upvote button (👍 or ▲ icon + count) to each PostCard on the feed and on the post detail page. Tapping it inserts a row into the `votes` table (user_id + post_id). Tapping again removes the vote (delete from votes). The button should visually toggle between "not voted" (muted) and "voted" (blue/highlighted). Update the post's upvote count optimistically in the UI, then sync with the database.

To show whether the current user has already voted, query the `votes` table filtered by user_id when loading posts. You can do this as a joined query or a separate lookup — whichever is simpler.

### Story 11.2 — Upvote button on comments
Same mechanic as posts, but on comments within a post detail page. Each comment gets an upvote toggle. Uses the `votes` table with comment_id instead of post_id. This is what powers "Most helpful" sorting later.

### Story 11.3 — Sort comments by most helpful
On the post detail page, change the comment sort order to: upvotes descending, then created_at descending. This means the most upvoted replies float to the top. Add a small label above the comment list: "Sorted by most helpful". No need for a sort toggle in day 2 — just default to this order.

---

## Epic 12: Feed Sorting & Filtering

**What it's about:** As content grows beyond the initial 10 seeded posts, users need ways to find what's relevant. This epic adds category tabs and sort options to the feed so it scales beyond a simple chronological list.

### Story 12.1 — Category filter tabs on feed
Add a horizontally scrollable row of filter chips at the top of the discussion list on the feed page. The chips are:
- **All** (default, selected state)
- 🧪 Has anyone tried...?
- 🤔 Why do I...?
- 🤷 What would you do?
- 😤 Just venting
- 💡 Tip / What worked

Tapping a category filters the post list to only show posts of that category. Tapping "All" removes the filter. This is a client-side filter on the Supabase query — add a `where category = X` clause when a filter is active.

### Story 12.2 — Sort toggle on feed
Add a small sort control near the top of the post list (next to or below the category filters). Two options, displayed as a segmented control or small text toggle:
- **Newest** (default) — sorted by created_at desc
- **Most discussed** — sorted by comment_count desc

Keep it simple — two options is enough for now. "Trending" algorithms can wait until you have enough activity to make them meaningful.

### Story 12.3 — Post search
Add a search input at the top of the feed (above category filters). It filters posts by matching the query against the title and body fields. Use Supabase's `ilike` or `textSearch` for this. Include a subtle search icon and "Search discussions..." placeholder text. Debounce the input by ~300ms so it doesn't fire on every keystroke.

---

## Epic 13: Real Counts (Replace Faked Data)

**What it's about:** The MVP landing page shows aspirational numbers (12K members, 850 discussions, 47 patterns). Day 2 replaces these with real counts wherever possible. Even if the numbers are small ("23 members"), authenticity builds trust. Small real numbers are better than large fake ones once the app is live.

### Story 13.1 — Live member count
On the landing page, replace the hardcoded "12K+" with a real count of rows in the `profiles` table. Create a Supabase function or just query `select count(*) from profiles`. If the count is under 50, display it as-is ("23 Members"). Over 50, you can start rounding ("50+ Members"). Over 1000, use "1K+". This query can run server-side so it's fresh on every page load.

### Story 13.2 — Live discussion and comment counts
Replace "850+ Discussions" with the real count of posts. Similarly, add a total comment count somewhere if useful. Same approach: server-side query, display the real number. Consider showing "23 Discussions · 67 Replies" to make even small numbers feel like activity.

### Story 13.3 — Active flare counter on feed
On the feed page, make the "X members flaring now" banner dynamic. Query the `flares` table for rows where `status = 'active'`. Display the count. If zero, either hide the banner or show "No active flares right now — good news!" If 1+, show "🔥 X member(s) flaring right now" with an empathetic tone. Consider using Supabase Realtime to subscribe to the flares table so the count updates live without page refresh.

### Story 13.4 — Replace "47 Patterns found" with insight count
Since pattern insights are still hardcoded seed data, change the landing page to either show the count of seeded insights honestly ("10 Insights") or rephrase it to "Community-sourced insights" without a specific number. Alternatively, count the unique insights and display that. The goal is to remove anything that feels dishonest now that real users are looking at it.

---

## Epic 14: Check-in Streaks & Personal Stats

**What it's about:** The daily check-in is useless if there's no reward for consistency. Streaks add a light gamification layer that boosts retention without being manipulative. People who see "14-day streak" feel motivated to maintain it. People who break a streak feel a small pull to restart.

### Story 14.1 — Calculate check-in streak
Write a function (server-side or database function) that calculates the current user's consecutive check-in streak. Logic: starting from today's date, walk backwards through the `checkins` table for this user. Count how many consecutive days have a check-in row. Stop at the first gap. Return the count.

Example: if a user has check-ins for Feb 25, 24, 23, 22, but not Feb 21, their streak is 4.

### Story 14.2 — Streak display on feed
After the user completes their daily check-in and the nudge card disappears, replace it with a streak card: "🔥 X-day check-in streak! Your record: Y days." Show this in a subtle, positive card at the top of the feed. If the streak is 0 or 1, show encouragement: "First check-in today! Start building your streak." If it's their longest streak ever, add a small "New record!" badge.

### Story 14.3 — Streak display on profile
On the profile page, add a stats section showing:
- Current check-in streak (e.g. "14 days")
- Longest streak ever
- Total check-ins completed
- Total flares logged
- Total comments posted

Display these in a 2- or 3-column grid of stat cards with the number prominent and a label below. These give the user a sense of investment and progress.

### Story 14.4 — Record the longest streak
Add a `longest_streak` integer column to the `profiles` table (default 0). Whenever a check-in is submitted and the calculated current streak exceeds `longest_streak`, update the profile row. This avoids recalculating history every time.

---

## Epic 15: Flare Lifecycle

**What it's about:** In the MVP, logging a flare is a one-shot action — you log it and see tips. But flares last days. This epic adds the ability to update and resolve flares, creating a proper flare history that becomes valuable data over time.

### Story 15.1 — Active flare banner on feed
If the current user has an active flare (status = 'active'), show a persistent banner at the very top of the feed: "You're flaring — [joint], severity [X]. How are you now? Update →". This links to a flare update screen. The banner uses a red/urgent style to distinguish it from other cards.

### Story 15.2 — Flare update page
Create a page at `/flare/[id]` (or a modal) that lets the user update their active flare:
- **Current severity** — same 1-10 selector, pre-filled with last value
- **Status change** — three options: "Still active" / "Improving" / "Resolved"
- **Notes** — optional text field: "What have you tried? How's it going?"
- **Submit** — updates the flare row. If status is "resolved", set `resolved_at` to now.

### Story 15.3 — Flare history on profile
On the profile page, add a "Flare History" section below the stats. Show a simple list of past flares: date, joint, peak severity, duration (calculated from started_at to resolved_at), and status. Most recent first. If the user has no past flares, show "No flares logged yet — hopefully it stays that way! 🤞"

---

## Epic 16: PWA & Install

**What it's about:** A Next.js web app on mobile feels second-class compared to a native app. Adding PWA support lets users "install" it to their home screen. It then opens full-screen without the browser chrome, feels native, and is one tap away. This is critical for a daily-use app like this — you need to be on their home screen, not buried in a browser tab.

### Story 16.1 — PWA manifest
Create a `manifest.json` (or `manifest.webmanifest`) in the public folder with:
- App name: "GoutWise"
- Short name: "GoutWise"
- Start URL: "/feed"
- Display: "standalone"
- Background color: "#0c0c14"
- Theme color: "#0c0c14"
- Icons: create a simple app icon at 192x192 and 512x512 (can be a minimalist 🤝 or 🔥 on a dark background — generate or use a simple design tool)

Reference the manifest in the root layout's `<head>` via a `<link>` tag.

### Story 16.2 — Meta tags for mobile
In the root layout, add mobile-optimized meta tags:
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<meta name="theme-color" content="#0c0c14">`
- Apple touch icon link
- Viewport: `width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover`

These ensure the app looks right when added to iOS home screen — no white status bar, proper safe areas, no pinch-zoom jank.

### Story 16.3 — Install prompt
On the feed page, if the user is visiting from a mobile browser (not already installed), show a one-time dismissible banner: "📱 Add GoutWise to your home screen for the best experience." Include brief instructions or a button that triggers the browser's native install prompt (where supported). Store dismissal in localStorage so it doesn't reappear.

---

## Epic 17: Share & Invite

**What it's about:** Growth. The app only gets better with more people. But health communities grow through trust, not viral loops. The invite mechanism should feel personal ("I found this helpful, you might too") rather than spammy ("Invite 10 friends to unlock features!").

### Story 17.1 — Share post button
On each post detail page, add a "Share" button. Tapping it uses the Web Share API (navigator.share) to open the native share sheet on mobile. The shared content is:
- Title: the post title
- Text: first 100 characters of the body + "— from the GoutWise community"
- URL: the post's public URL

If Web Share API isn't available (desktop), fall back to copying the URL to clipboard with a "Link copied!" toast.

### Story 17.2 — Invite to GoutWise button on profile
On the profile page, add an "Invite someone" button. Tapping it shares a generic invite link with the message: "I've been using GoutWise — a community for people with gout. Real tips, real patterns, real support. Check it out: [URL]". Uses the same Web Share API / clipboard fallback.

### Story 17.3 — Public post pages (SSR)
Make post detail pages (`/post/[id]`) publicly accessible to non-authenticated users. When someone clicks a shared link, they should see the full post and comments without needing to log in. At the bottom, show a CTA: "Join the conversation — it's free." This means adjusting the middleware to allow `/post/[id]` as a public route, and rendering the page server-side so link previews work correctly in messaging apps.

### Story 17.4 — Open Graph meta tags
On public post pages, add dynamic OG meta tags so shared links preview nicely in iMessage, WhatsApp, Slack, etc:
- `og:title` — the post title
- `og:description` — first 150 characters of the body
- `og:image` — a generic GoutWise branded image (create one simple image with the logo/name)
- `og:url` — the canonical post URL

This is done via Next.js's `generateMetadata` function in the post page.

---

## Epic 18: Quality of Life Improvements

**What it's about:** Small polish items that individually seem minor but collectively make the app feel professional and considered. These are the things that separate "weekend project" from "this feels like a real product."

### Story 18.1 — Relative timestamps
Replace raw timestamps throughout the app with human-readable relative times: "2 minutes ago", "3 hours ago", "yesterday", "5 days ago". Write a small utility function or use a lightweight library like `date-fns/formatDistanceToNow`. Apply it to post cards, comments, and flare history.

### Story 18.2 — Empty states
Add thoughtful empty states for every list that could be empty:
- Feed with no posts: "No discussions yet. Be the first to start a conversation! →"
- Post with no comments: "No replies yet. Share your experience below."
- Profile with no flares: "No flares logged — let's keep it that way! 🤞"
- Profile with no check-ins: "Start your first check-in to begin tracking patterns."

Each empty state should have an actionable link or button, not just text.

### Story 18.3 — Loading states
Add skeleton loaders or spinner states for:
- Feed page while posts load
- Post detail while comments load
- Any button in a submitting state ("Posting..." / "Saving...")

Prevent double-submission on all forms by disabling the submit button while a request is in flight.

### Story 18.4 — Toast notifications
Add a lightweight toast/snackbar system for confirmations:
- "Post created!" (after creating a discussion)
- "Comment posted!" (after replying)
- "Flare logged. Hang in there." (after logging a flare)
- "Check-in saved ✓" (after daily check-in)
- "Link copied!" (after share fallback)

These are brief (2–3 seconds), non-blocking, appear at the top or bottom of the screen, then auto-dismiss.

### Story 18.5 — Delete own posts and comments
Let users delete their own content. Add a small "..." menu or trash icon on posts and comments where `author_id` matches the current user. Tapping it shows a confirmation ("Delete this post?"), then soft-deletes or hard-deletes from the database. Add a corresponding RLS policy: "Users can delete own posts" and "Users can delete own comments."

### Story 18.6 — Scroll to top on feed
When the user taps the Feed tab in the bottom nav while already on the feed, scroll to top. This is standard mobile UX behavior that people expect.

---

## Day 2 Build Order

| # | Epic | Estimated Time | Priority |
|---|------|---------------|----------|
| 1 | Epic 11: Upvoting | 45 min | Must have |
| 2 | Epic 12: Feed sorting & filtering | 35 min | Must have |
| 3 | Epic 14: Check-in streaks & stats | 30 min | Must have |
| 4 | Epic 13: Real counts | 25 min | Should have |
| 5 | Epic 15: Flare lifecycle | 30 min | Should have |
| 6 | Epic 18: Quality of life | 40 min | Should have |
| 7 | Epic 16: PWA & install | 25 min | Should have |
| 8 | Epic 17: Share & invite | 35 min | Nice to have |
| | **Total** | **~4.5 hours** | |

The top 3 epics (upvoting, filtering, streaks) are your highest-impact items. If you only get through those, day 2 is still a success. Epics 16–17 (PWA + sharing) are growth enablers — important but can slip to day 3 if needed.

---

## Day 3+ Roadmap (What Comes After)

For context on where this is all heading:

**Week 1:**
- Email notifications for replies to your posts
- "Trending" sort algorithm (upvotes × recency)
- Community polls (structured questions with aggregated results)
- Basic moderation tools (report content, admin review)

**Week 2:**
- Personal dashboard with check-in trend visualization (mood, stress, hydration over time)
- Flare correlation view: "Your flares tend to follow: high stress + alcohol + poor sleep"
- Pattern feed v1: auto-generated insights from real aggregate community data

**Week 3–4:**
- Push notifications via service worker
- "People like you" — content recommendations based on profile similarity
- Auto-generated flare stories from check-in + flare data
- Premium tier: deep personal analytics, export doctor reports

**Month 2+:**
- "State of Gout" community report (publishable, attracts press)
- Affiliate integrations for community-recommended products
- Telehealth partnership exploration
- Data licensing conversations with pharma/research
