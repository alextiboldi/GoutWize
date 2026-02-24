export interface SeedPost {
  title: string;
  body: string;
  category: string;
  upvotes: number;
  comments: SeedComment[];
}

export interface SeedComment {
  body: string;
  tried_it: string | null;
  upvotes: number;
}

export const seedPosts: SeedPost[] = [
  {
    title: "Has anyone tried tart cherry juice? Does it actually work?",
    body: "I keep hearing about cherry juice for gout but I'm skeptical. My friend swears by it but I wonder if it's placebo. Has anyone here tried it consistently and seen a real difference?",
    category: "has_anyone_tried",
    upvotes: 24,
    comments: [
      {
        body: "Been taking tart cherry extract capsules daily for 6 months. Went from flaring monthly to maybe once a quarter. Not a cure but noticeable improvement.",
        tried_it: "worked",
        upvotes: 18,
      },
      {
        body: "Tried the juice for 3 months. Hard to tell if it helped or if other changes I made were the real factor. Tasted good though.",
        tried_it: "mixed",
        upvotes: 9,
      },
      {
        body: "Tried both the juice and extract for a full year. Zero difference for me. Everyone's gout is different.",
        tried_it: "didnt_work",
        upvotes: 12,
      },
    ],
  },
  {
    title: "Why do I flare even when I eat clean?",
    body: "I've been super strict with my diet for 3 weeks — no red meat, no alcohol, tons of water. Still got a flare in my big toe last night. What gives? Is diet even the main factor?",
    category: "why_do_i",
    upvotes: 31,
    comments: [
      {
        body: "Diet is maybe 30% of the equation. Genetics, stress, hydration, and medication compliance matter way more for most people. Don't beat yourself up over food.",
        tried_it: null,
        upvotes: 22,
      },
      {
        body: "Same thing happened to me. Turns out my uric acid was way too high for diet alone to manage. Started allopurinol and it changed everything.",
        tried_it: "worked",
        upvotes: 15,
      },
    ],
  },
  {
    title: "I flare unpredictably every few months — anyone else?",
    body: "I can eat and drink whatever I want for 2-3 months with zero issues, then boom — flare out of nowhere. The randomness is almost worse than the pain because I never see it coming. Anyone relate?",
    category: "general",
    upvotes: 19,
    comments: [
      {
        body: "This is me exactly. I've started logging everything in this app and I'm starting to see that stress + poor sleep is usually the combo that gets me. The food doesn't seem to matter as much.",
        tried_it: null,
        upvotes: 14,
      },
      {
        body: "The unpredictability is the worst part. I've cancelled trips, missed events, all because a flare decided to show up. You're not alone.",
        tried_it: null,
        upvotes: 11,
      },
      {
        body: "My rheumatologist explained that uric acid crystals build up silently and then something tips you over the edge. That's why it feels random — the crystals were forming for weeks before the flare.",
        tried_it: null,
        upvotes: 20,
      },
    ],
  },
  {
    title: "My doctor wants me on allopurinol at 34 — what would you do?",
    body: "I'm 34 and flare about 3x per year. My rheumatologist recommends starting allopurinol but I'm nervous about being on daily medication for life at my age. Anyone been in this situation?",
    category: "what_would_you_do",
    upvotes: 27,
    comments: [
      {
        body: "I was in the exact same boat at 32. Resisted for 2 years, tried every natural remedy. Finally gave in and started allo — wish I'd done it sooner. Haven't flared in 8 months.",
        tried_it: "worked",
        upvotes: 19,
      },
      {
        body: "Started at 36. The first month was rough (had a couple of flares as my body adjusted) but after that, life-changing. My UA went from 9.2 to 4.8.",
        tried_it: "worked",
        upvotes: 16,
      },
      {
        body: "I chose to manage with lifestyle changes first. Lost 20 lbs, cut alcohol, drink tons of water. Went from 3x/year to 1x/year. Not zero but manageable without meds for now.",
        tried_it: "mixed",
        upvotes: 13,
      },
    ],
  },
  {
    title: "Tip: Drinking water before bed has been a game changer for me",
    body: "I started forcing myself to drink a full glass of water right before sleep, and another one when I wake up at night. My overnight flares have basically stopped. It's been 4 months now. So simple but it made a huge difference.",
    category: "tip",
    upvotes: 42,
    comments: [
      {
        body: "Started doing this after seeing your post. It's been 6 weeks and I've noticed a difference. Used to wake up with stiff joints almost every morning.",
        tried_it: "worked",
        upvotes: 8,
      },
      {
        body: "Good tip but I end up waking up to use the bathroom which ruins my sleep. Trying to find the right balance.",
        tried_it: "mixed",
        upvotes: 5,
      },
    ],
  },
  {
    title: "Does weather actually affect your flares?",
    body: "I feel like I flare more when it rains or humidity is high. My doctor says there's no scientific evidence for this but my body says otherwise. Am I imagining things?",
    category: "general",
    upvotes: 16,
    comments: [
      {
        body: "You're not imagining it. Barometric pressure changes can affect joint fluid. There's actually some emerging research on this. Trust your body.",
        tried_it: null,
        upvotes: 12,
      },
      {
        body: "I moved from Florida to Colorado and my flare frequency dropped dramatically. Could be the lower humidity, could be coincidence, but I don't think so.",
        tried_it: null,
        upvotes: 9,
      },
      {
        body: "Every single one of my bad flares has been during a weather front moving in. My wife thinks I'm crazy but I can literally predict rain with my big toe now.",
        tried_it: null,
        upvotes: 15,
      },
    ],
  },
  {
    title: "Just need to vent — gout at 28 is embarrassing",
    body: "I'm 28 and people literally laugh when I tell them I have gout. They think it's an old man's disease. I'm in great shape, eat well, barely drink. It's genetic and I'm tired of explaining myself. Just needed to get that off my chest.",
    category: "just_venting",
    upvotes: 38,
    comments: [
      {
        body: "Got diagnosed at 25. The stigma is real. I stopped telling people and just say 'joint inflammation' instead. Sucks that we have to do that.",
        tried_it: null,
        upvotes: 21,
      },
      {
        body: "The 'king's disease' stereotype is so outdated. It's largely genetic. You didn't do anything wrong. This community gets it.",
        tried_it: null,
        upvotes: 17,
      },
    ],
  },
  {
    title: "Has anyone tried intermittent fasting for gout?",
    body: "Read some articles suggesting IF can help reduce uric acid levels. I'm considering trying 16:8 but worried that fasting itself might trigger flares. Anyone have experience with this?",
    category: "has_anyone_tried",
    upvotes: 14,
    comments: [
      {
        body: "Did 16:8 for 3 months. Actually triggered a flare in the first week (dehydration from not drinking enough during fasting). After adjusting, no issues and I lost weight which probably helped more than the fasting itself.",
        tried_it: "mixed",
        upvotes: 10,
      },
      {
        body: "My rheumatologist warned me that fasting can spike uric acid short-term. I tried it anyway and got a bad flare on week 2. Stopped immediately.",
        tried_it: "didnt_work",
        upvotes: 8,
      },
      {
        body: "Been doing 18:6 for over a year now. No flare issues at all, but I make sure to drink plenty of water during the fast. Lost 15 lbs and my UA dropped from 8.1 to 6.9.",
        tried_it: "worked",
        upvotes: 13,
      },
    ],
  },
  {
    title: "Tip: Track your stress, not just your food",
    body: "After a year of obsessively logging everything I ate and getting nowhere, I started tracking my stress levels instead. Turns out my worst flares all came after high-stress periods at work, regardless of what I ate. Changed my whole perspective.",
    category: "tip",
    upvotes: 35,
    comments: [
      {
        body: "This is exactly why I love the daily check-in feature here. Being able to log stress alongside everything else has been eye-opening. My pattern is: high stress → poor sleep → flare within 3 days.",
        tried_it: "worked",
        upvotes: 16,
      },
      {
        body: "Interesting perspective. I've been so focused on purines and diet that I never considered stress. Going to start paying attention to this.",
        tried_it: null,
        upvotes: 7,
      },
    ],
  },
  {
    title: "Why does my first flare of the year always happen in January?",
    body: "For the past 3 years, my first flare hits in January without fail. Holiday eating? Cold weather? New Year stress? I can't figure out the pattern. Anyone else notice seasonal trends?",
    category: "why_do_i",
    upvotes: 18,
    comments: [
      {
        body: "December is usually a perfect storm: rich food, more alcohol, less exercise, holiday stress, cold weather, and dehydration. January is when your body finally rebels.",
        tried_it: null,
        upvotes: 14,
      },
      {
        body: "Mine is always after Thanksgiving. I've just accepted it and now I pre-hydrate like crazy the whole week before. Seemed to help last year.",
        tried_it: "worked",
        upvotes: 9,
      },
      {
        body: "Cold weather constricts blood vessels which can trigger crystal formation in joints. There's actually some science behind seasonal flares.",
        tried_it: null,
        upvotes: 11,
      },
    ],
  },
];
