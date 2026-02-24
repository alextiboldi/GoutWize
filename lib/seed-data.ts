import { Insight, ReliefTip } from "./types";

export const seedInsights: Insight[] = [
  {
    icon: "😤",
    stat: "68%",
    text: "of gout sufferers report stress as a significant trigger — often more impactful than diet alone",
    source: "Community reports + BMJ research",
  },
  {
    icon: "🍺",
    stat: "3x",
    text: "Beer is associated with 3x higher flare risk compared to wine or spirits at equivalent alcohol levels",
    source: "Lancet 2004, community validated",
  },
  {
    icon: "💧",
    stat: "34%",
    text: "Members who maintain good hydration report significantly fewer flares than those who don't track water intake",
    source: "Community pattern",
  },
  {
    icon: "😴",
    stat: "2.1x",
    text: "Poor sleep (3+ bad nights in a week) correlates with double the flare risk in community reports",
    source: "Emerging community pattern",
  },
  {
    icon: "🍒",
    stat: "45%",
    text: "of members who tried tart cherry juice report noticeable improvement. Results vary significantly by person",
    source: "Community poll, 2400+ responses",
  },
  {
    icon: "✈️",
    stat: "High",
    text: "Air travel + dehydration is one of the most commonly reported trigger combinations for unexpected flares",
    source: "Community reports",
  },
  {
    icon: "🌡️",
    stat: "22%",
    text: "Members in humid climates report more frequent flares than those in dry climates",
    source: "Emerging geographic pattern",
  },
  {
    icon: "📅",
    stat: "#1",
    text: "Monday is the most commonly reported flare onset day. Weekend lifestyle changes may be a factor",
    source: "Community data analysis",
  },
  {
    icon: "⚖️",
    stat: "50%",
    text: "of patients on standard allopurinol doses don't reach therapeutic targets. Dose optimization matters",
    source: "Clinical research",
  },
  {
    icon: "🥩",
    stat: "Myth?",
    text: "45% of members who strictly avoid red meat still flare regularly. Diet is only part of the picture",
    source: "Community survey",
  },
];

export const reliefTips: ReliefTip[] = [
  {
    icon: "🧊",
    tip: "Elevate the joint + apply ice pack (20 min on, 20 min off)",
    helpfulPct: 78,
    memberCount: 4200,
  },
  {
    icon: "💊",
    tip: "Colchicine within the first 12 hours (consult your doctor for dosing)",
    helpfulPct: 71,
    memberCount: 3800,
  },
  {
    icon: "💧",
    tip: "Drink a large glass of water immediately, then keep drinking throughout",
    helpfulPct: 64,
    memberCount: 4100,
  },
  {
    icon: "🍒",
    tip: "Tart cherry juice concentrate — many members report it helps during active flares",
    helpfulPct: 52,
    memberCount: 2900,
  },
  {
    icon: "🛏️",
    tip: "Keep a blanket cradle/tent over the affected joint — even sheet contact hurts",
    helpfulPct: 61,
    memberCount: 3200,
  },
  {
    icon: "🚫",
    tip: "Avoid alcohol completely until the flare fully resolves",
    helpfulPct: 69,
    memberCount: 3500,
  },
];

export function getRandomInsights(count: number = 3): Insight[] {
  const shuffled = [...seedInsights].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
