export interface SeedPoll {
  question: string;
  options: string[];
}

export const seedPolls: SeedPoll[] = [
  {
    question: "What triggers your gout flares most often?",
    options: [
      "Red meat / organ meats",
      "Alcohol (beer/spirits)",
      "Dehydration",
      "Stress / lack of sleep",
      "Weather changes",
      "I honestly don't know yet",
    ],
  },
  {
    question: "Does weather affect your gout?",
    options: [
      "Yes — cold weather is worse",
      "Yes — hot weather is worse",
      "Yes — humidity is the trigger",
      "No noticeable effect",
    ],
  },
  {
    question: "What gives you the most relief during a flare?",
    options: [
      "Ice / elevation",
      "Colchicine",
      "NSAIDs (ibuprofen, naproxen)",
      "Cherry juice / tart cherry",
      "Just rest and wait it out",
    ],
  },
  {
    question: "How long do your flares typically last?",
    options: [
      "1-2 days",
      "3-5 days",
      "About a week",
      "More than a week",
      "It varies a lot",
    ],
  },
  {
    question: "Are you currently on urate-lowering medication?",
    options: [
      "Yes — allopurinol",
      "Yes — febuxostat",
      "Yes — other",
      "No — managing with diet/lifestyle",
      "No — newly diagnosed",
    ],
  },
];
