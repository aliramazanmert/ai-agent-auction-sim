export const AGENTS = [
  { id: "ana", name: "Ana", value: 100 },
  { id: "ben", name: "Ben", value: 80 },
  { id: "cam", name: "Cam", value: 65 },
  { id: "dee", name: "Dee", value: 50 },
  { id: "eve", name: "Eve", value: 40 },
] as const;

export const LEGAL_BIDS = [20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

export type AgentId = (typeof AGENTS)[number]["id"];
export type LegalBid = (typeof LEGAL_BIDS)[number];

export type BidDecision = {
  submitted: boolean;
  bid: LegalBid | null;
};

export type RoundState = {
  decisions: Record<AgentId, BidDecision>;
};

export type SettlementRow = {
  agentId: AgentId;
  name: string;
  value: number;
  bid: LegalBid | null;
  payment: number;
  payoff: number;
};

export type Settlement = {
  winnerId: AgentId | null;
  rows: SettlementRow[];
};
