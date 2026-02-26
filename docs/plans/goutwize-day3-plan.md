# GoutWise Day 3 — Build Plan

**Context:** MVP is live (day 1). The app feels alive with upvoting, filtering, streaks, real counts, flare lifecycle, PWA, and sharing (day 2). Users can sign up, post, comment, vote, log flares, do check-ins, and invite others.

**Day 3 Theme: Start getting smart.**

The community is generating real data now — check-ins, flares, votes, tried-it badges, profile attributes. Day 3 is about closing the loop: turning that raw data into visible intelligence that users can't get anywhere else. This is where the app stops being "a nice forum" and starts becoming the Gout Intelligence Network you envisioned.

---

## Epic 19: Community Polls

**What it's about:** Polls are structured questions where every response is a countable data point. They're the fastest way to generate aggregate insights while also being the easiest content to engage with — one tap to participate, instant gratification seeing results. Polls feed directly into the pattern engine later. They're also an engagement magnet: polls consistently get 5–10x more participation than text posts on any platform.

### Story 19.1 — Poll data model
Add a new table `polls` with: id, author_id, question text, created_at, and a boolean `closed` flag. Add a related table `poll_options` with: id, poll_id, label text, vote_count (integer, default 0), display_order. Add a `poll_votes` table with: id, poll_id, option_id, user_id, created_at — with a unique constraint on (poll_id, user_id) so each person votes once. Enable RLS: polls and options are publicly readable, poll_votes scoped to authenticated users, only your own vote is readable to you.

### Story 19.2 — Create poll page
Add a new post type or a separate route `/poll/new`. The creation form has:
- Question text input — placeholder: "Ask the community something..."
- 2–6 option inputs — start with 2 visible, "Add option" button to add more (max 6)
- Submit button: "Post Poll"

On submit: insert the poll row, then insert each option. Redirect to the poll detail page.

### Story 19.3 — Poll display card on feed
Polls appear in the feed alongside discussion posts. The poll card shows:
- The question text (bold)
- If the user hasn't voted: tappable option buttons (full width, stacked)
- If the user has voted: results view — each option shows a horizontal bar with percentage fill, the vote count, and a checkmark on the option they chose
- Total vote count at the bottom: "X people voted"

After tapping an option, the card immediately transitions to the results view with a smooth animation. The user's vote is highlighted.

### Story 19.4 — Poll detail page
At `/poll/[id]`, shows the full poll with results (same as the card but larger), plus a comment section below where people can discuss the results. This uses the same comment system from discussions — people can leave tried-it badges here too if relevant.

### Story 19.5 — Seed starter polls
Create 4–5 polls yourself to populate the feed:

1. "What's your #1 suspected trigger?"
   Options: Stress · Alcohol · Red meat · Dehydration · Seafood · No idea

2. "Does weather affect your flares?"
   Options: Definitely yes · I think so · Not sure · Definitely no

3. "What's your go-to immediate relief?"
   Options: Ice/elevation · Colchicine · NSAIDs · Cherry juice · Water · Just wait it out

4. "How long does your average flare last?"
   Options: 1–2 days · 3–4 days · 5–7 days · Over a week

5. "Are you on daily urate-lowering medication?"
   Options: Yes, allopurinol · Yes, febuxostat · Yes, other · No, managing without · Considering it

---

## Epic 20: Notification System (In-App)

**What it's about:** Without notifications, users only see activity when they actively open the app and browse. This means they miss replies to their posts, votes on their comments, and community activity that would pull them back in. In-app notifications create a reason to return and a sense of being part of something living. We start with in-app (a notifications tab/page) before tackling push notifications or email, because it's simpler and still effective.

### Story 20.1 — Notifications table
Add a `notifications` table with: id, user_id (recipient), type (enum: 'comment_on_post', 'reply_mentioned', 'upvote_post', 'upvote_comment', 'flare_support', 'poll_result'), reference_id (the post/comment/poll id that triggered it), actor_id (the user who caused it), message text, read boolean (default false), created_at. Enable RLS: users can only read and update their own notifications.

### Story 20.2 — Generate notifications on events
Set up Supabase database triggers or application-level logic to create notification rows when:
- Someone comments on your post → "GoutWarrior_42 replied to your discussion: [title]"
- Someone upvotes your post → "Your post received an upvote" (batch these — don't notify on every single vote, but periodically: "Your post has 5 new upvotes")
- Someone upvotes your comment → "Your comment was upvoted"
- A poll you created gets significant participation → "Your poll has 25 votes! See results"

Keep it conservative at first — only notify on comments and direct interactions. Too many notifications kill trust fast.

### Story 20.3 — Notifications page
Add a new route `/notifications` accessible from a bell icon in the top bar or as a 5th tab in the bottom nav (replacing one of the existing tabs, or adding it to the top header area). The page shows a chronological list of notifications. Unread ones have a blue dot or highlighted background. Tapping a notification marks it as read and navigates to the relevant post/comment/poll. Add a "Mark all as read" button at the top.

### Story 20.4 — Unread badge
On the notification bell icon (wherever you place it), show a small red badge with the unread count if > 0. Query `select count(*) from notifications where user_id = X and read = false`. This badge is the visual hook that pulls users into the notifications page.

---

## Epic 21: Personal Dashboard v1

**What it's about:** The user has been doing check-ins and logging flares for a couple of days now. This epic gives them something back — a personal page that visualizes their own data and starts revealing their individual patterns. This is the "aha moment" feature: when someone sees their own stress + alcohol correlation laid out visually, that's when the app becomes indispensable.

### Story 21.1 — Dashboard page
Create a new route `/dashboard` (accessible from the profile page or as a link in the feed). This is the personal analytics home. It's organized into sections described in the stories below. For now, it requires at least 3 check-ins to show anything meaningful — if the user has fewer, show an encouraging message: "Complete a few more check-ins to start seeing your patterns. You're X away!"

### Story 21.2 — Check-in history visualization
Show the user's last 14–30 days of check-ins as a visual timeline or grid. Each day is a small cell showing color-coded mood (green/yellow/red). Days with no check-in are gray/empty. Days with a flare have a 🔥 marker. This gives an at-a-glance view of "how have I been feeling" and immediately shows flare days in context.

Implementation: query the last 30 days of check-ins for this user, query their flares for the same period, merge by date, render as a grid of small colored squares (think GitHub contribution graph but for health).

### Story 21.3 — Flare correlation cards
This is the hero feature of the dashboard. Look at the user's flare data and the check-ins in the 7 days preceding each flare. For each flare, aggregate the pre-flare check-in data and surface the most common patterns.

Logic:
1. Get all the user's resolved or active flares
2. For each flare, get the check-ins from the 7 days before it started
3. Aggregate: what percentage of pre-flare periods had "high stress" (4–5)? "heavy alcohol"? "low hydration"? "bad mood"?
4. Compare against their overall averages (all check-ins, not just pre-flare)
5. If a factor appears significantly more in pre-flare periods than in general, flag it

Display as cards:
- "3 out of 3 flares were preceded by high stress" → "⚠️ Strong correlation with stress"
- "2 out of 3 flares followed heavy alcohol within 48 hours" → "⚠️ Likely link to alcohol"
- "Hydration was low before 2 of 3 flares" → "🔍 Possible hydration connection"

If the user has fewer than 2 flares logged, show: "Log more flares to start seeing your personal trigger patterns. Every data point helps."

This is the feature that no other gout app offers. It's personalized, data-driven, and emerges naturally from the simple check-ins they've already been doing.

### Story 21.4 — Flare-free streak counter
Display prominently at the top of the dashboard: "X days flare-free" with a progress bar showing their current streak versus their personal record. Calculate from the resolved_at of their most recent flare to today. If they have no flares logged, show: "No flares logged — tracking your clear days starts when you log your first flare."

### Story 21.5 — Dashboard link in navigation
Add a link to the dashboard from:
- The profile page (a "View my patterns" or "My Dashboard" button)
- The feed page (a small card: "📊 Your dashboard: X days flare-free, X-day check-in streak → View")

The dashboard should feel like a reward for consistent check-ins, not a chore. Frame it as "here's what your data reveals about you."

---

## Epic 22: Tried-It Aggregation on Posts

**What it's about:** Discussions have comments with tried-it badges (worked/didn't/mixed), but right now there's no summary view. If a post about cherry juice has 30 comments with tried-it badges, you have to read all 30 to get a sense of the verdict. This epic adds a summary bar that instantly shows the community consensus, making discussions much more scannable and valuable.

### Story 22.1 — Tried-it summary on post detail
At the top of the comments section on a post detail page, if any comments have tried-it badges, show a summary bar:

"**15 members shared their experience:**
✅ 7 said it worked (47%) · ⚠️ 5 said mixed results (33%) · ❌ 3 said it didn't work (20%)"

Display this as a horizontal stacked bar (green/amber/red segments proportional to the counts) with the numbers below. This appears only on posts that have at least 3 comments with tried-it badges — below that threshold, the data isn't meaningful enough to summarize.

Implementation: query comments for this post where tried_it is not null, group by tried_it value, count each.

### Story 22.2 — Tried-it summary on post card
On the feed, if a post has 3+ tried-it responses, show a mini version of the summary on the PostCard itself: a small stacked bar with just the percentages, or a short text like "✅ 7 worked · ⚠️ 5 mixed · ❌ 3 didn't". This makes posts with real experiential data stand out in the feed and encourages clicking through. Posts without tried-it data don't show this element — it's not a required field.

### Story 22.3 — Encourage tried-it badges in UI
When a user starts typing a comment on a post in the "has_anyone_tried" or "tip" categories, show a subtle prompt above the tried-it selector: "Have you tried this? Your experience helps the community." This isn't blocking or annoying — just a gentle nudge to use the feature. On other categories, the tried-it selector is still visible but without the nudge.

---

## Epic 23: Moderation & Community Health

**What it's about:** As the community grows beyond friends and early adopters, you'll encounter spam, bad advice, hostile users, and potentially dangerous medical misinformation. This epic puts basic guardrails in place before you need them. It's much easier to establish community norms early than to retrofit them after problems emerge.

### Story 23.1 — Report content button
Add a small "Report" option (accessible from a "..." menu) on every post and comment. Tapping it shows a simple form with reason options:
- Spam or self-promotion
- Harmful or dangerous medical advice
- Harassment or disrespectful behavior
- Other (with text input)

On submit: insert a row into a new `reports` table with: id, reporter_id, post_id or comment_id, reason, details text, status (enum: 'pending', 'reviewed', 'actioned'), created_at. The reporter sees a "Thanks for reporting. We'll review this." confirmation.

### Story 23.2 — Admin review interface
Create a simple admin page at `/admin/reports` (protected by checking if the user's id matches your own user id, or a list of admin ids stored in an environment variable). This page lists all pending reports with the reported content, the reason, and action buttons:
- **Dismiss** — mark as reviewed, no action
- **Remove content** — delete the post or comment, mark report as actioned
- **Ban user** — add a `banned` boolean to profiles, set it to true. Banned users are redirected to a "Your account has been suspended" page by the middleware

This doesn't need to be pretty — it's an admin tool only you and future moderators will see.

### Story 23.3 — Community guidelines page
Create a static page at `/guidelines` that outlines the community rules. Link to it from the onboarding flow and the footer/profile page. Content:

**GoutWise Community Guidelines**

1. **Be respectful.** Everyone here is dealing with pain. Kindness costs nothing.
2. **Share experiences, not prescriptions.** Say "this worked for me" not "you should do this." We're not doctors.
3. **Medical disclaimer.** Nothing shared here replaces professional medical advice. Always consult your healthcare provider.
4. **No spam or self-promotion.** Don't advertise products, services, or affiliate links.
5. **Protect privacy.** Don't share others' personal information. Your own data is your choice.
6. **Report, don't retaliate.** If you see something concerning, use the report button.

### Story 23.4 — Medical disclaimer on relief tips
Add a subtle but always-visible disclaimer below the relief tips shown after logging a flare: "These tips are shared by community members based on personal experience. They are not medical advice. Always consult your doctor before starting or changing any treatment." Also add a similar disclaimer at the bottom of discussion posts in the "has_anyone_tried" and "tip" categories.

---

## Epic 24: Email Notifications (Basic)

**What it's about:** In-app notifications (Epic 20) only work if the user opens the app. Email brings them back when they haven't opened it in a while. Day 3 introduces just two email triggers — the minimum to re-engage lapsed users without being spammy. Use Supabase Edge Functions + Resend (or any transactional email service with a free tier).

### Story 24.1 — Email service setup
Set up Resend (or SendGrid/Postmark — Resend is simplest for a new project) with a verified sender domain or email. Create a Supabase Edge Function that can send emails. Store the API key as a Supabase secret. Create a simple HTML email template that matches the app's dark theme — or just use clean plain-text emails to start.

### Story 24.2 — "Someone replied to your post" email
When a notification of type 'comment_on_post' is created (Story 20.2), also trigger an email to the post author. The email says:

Subject: "New reply on your GoutWise discussion"
Body: "[Username] replied to your post: '[post title]' — [first 100 chars of comment]. View the conversation: [link to post]"

Include an unsubscribe link (or at minimum, a note saying they can turn off emails in their profile). Rate limit: max 1 email per post per hour, even if multiple comments come in. Batch them: "3 new replies on your post."

### Story 24.3 — "You haven't checked in" re-engagement email
Create a scheduled Supabase Edge Function (cron job) that runs daily. It finds users who:
- Have done at least 3 check-ins historically (so they've established the habit)
- Haven't done a check-in in 3+ days
- Haven't been emailed in the last 7 days (prevent spam)

Send them a gentle email:

Subject: "Your GoutWise check-in streak is at risk"
Body: "You had a X-day streak going! A quick 10-second check-in keeps your pattern data flowing. The more you log, the smarter your personal insights get. [Link to check-in]"

This is the single highest-impact re-engagement email you can send because it leverages loss aversion (the streak) and personal value (your patterns).

### Story 24.4 — Email preference on profile
Add an `email_notifications` boolean to the profiles table (default true). On the profile page, add a toggle: "Email notifications: On/Off". Check this flag before sending any email. Respect it absolutely — nothing destroys trust faster than ignoring notification preferences.

---

## Day 3 Build Order

| # | Epic | Estimated Time | Priority |
|---|------|---------------|----------|
| 1 | Epic 22: Tried-it aggregation | 30 min | Must have |
| 2 | Epic 21: Personal dashboard v1 | 60 min | Must have |
| 3 | Epic 19: Community polls | 50 min | Must have |
| 4 | Epic 23: Moderation & community health | 40 min | Must have |
| 5 | Epic 20: In-app notifications | 50 min | Should have |
| 6 | Epic 24: Email notifications | 45 min | Nice to have |
| | **Total** | **~4.5 hours** | |

**Why this order:**

Tried-it aggregation is first because it's quick, high-impact, and makes existing content more valuable without requiring new user behavior. Every "has anyone tried" post instantly becomes more useful.

Personal dashboard is second because it's the feature that makes check-ins feel worthwhile. If people have been checking in for 2 days and see nothing from it, they'll stop. The dashboard is the reward loop that sustains the habit.

Polls are third because they're a new engagement mechanic that generates structured data fast. One poll can get 50+ data points in a day — far more than any discussion thread.

Moderation is fourth because you need it before it's urgent. Having a report button and community guidelines in place before your first problematic post is much better than scrambling after one.

Notifications are fifth and sixth because they're engagement amplifiers — they make everything else work better — but they require more infrastructure and the app functions without them.

---

## End of Day 3: What You Have

After 3 days, the app includes:
- Landing page with real community data
- Auth (Google + magic link) with onboarding
- Discussion forum with categories, comments, tried-it badges, upvoting, and sorting
- Tried-it summaries showing community consensus
- Community polls with instant result visualization
- Flare logging with lifecycle (active → improving → resolved) and relief tips
- Daily check-ins with streak tracking
- Personal dashboard showing mood history, flare correlations, and flare-free streaks
- In-app notifications for replies and upvotes
- Basic email re-engagement for lapsed users
- Content reporting and admin moderation tools
- Community guidelines and medical disclaimers
- PWA support (add to home screen)
- Share and invite mechanics with OG previews
- Full mobile-first dark UI deployed on Vercel

That's a legitimate product. Not a prototype, not an MVP in the "barely works" sense — a real community platform that delivers unique value no other gout app offers.

---

## Week 2+ Horizon

For reference, here's what the next weeks look like:

**Week 2: Pattern Intelligence**
- Pattern feed v1: auto-generated insights from real aggregate data
- "People like you" content recommendations based on profile similarity
- Weekly digest email with top discussions and new insights
- Community stats page (public): total members, posts, flares logged, top insights

**Week 3: Deeper Personalization**
- Auto-generated flare stories from check-in + flare data
- Flare prediction alerts: "Based on your check-ins this week, your risk may be elevated"
- Personal trigger ranking: your top 3 suspected triggers based on data
- Premium tier launch: deep analytics, doctor export reports, ad-free

**Week 4: Growth & Authority**
- "State of Gout" first community report (publishable)
- SEO: make top discussions indexable, create landing pages for common gout questions
- Content partnerships: invite a rheumatologist to do an AMA-style discussion
- Affiliate integration for community-recommended products (cherry juice, supplements)

**Month 2+: Monetization**
- Premium subscriptions live
- Data licensing conversations with pharma/research partners
- Telehealth referral partnerships
- Employer wellness program positioning
