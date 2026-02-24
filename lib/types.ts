export type {
  Profile,
  Post,
  Comment,
  Vote,
  Checkin,
  Flare,
} from "../prisma/generated/prisma/client";

export interface Insight {
  icon: string;
  stat: string;
  text: string;
  source: string;
}

export interface ReliefTip {
  icon: string;
  tip: string;
  helpfulPct: number;
  memberCount: number;
}
