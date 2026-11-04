import type { AgentId, LegalBid } from "../engine/model";

export type JevPayload = {
  model: "jev-1.13.0";
  state: {
    rules: {
      format: "sealed first-price";
      payment: string;
      legal_bid_ticks_usd: readonly LegalBid[];
      overbidding: string;
    };
    public: {
      bidder_count: 5;
      bids_are_sealed: true;
      other_bids_visible: false;
    };
    me: {
      agent_id: AgentId;
      private_value_usd: number;
      profile: {
        label: string;
        risk_attitude: "cautious" | "balanced" | "bold";
        competition_belief: "strong" | "moderate" | "weak";
      };
    };
  };
  questions: {
    should_bid: {
      type: "noul";
      instructions: string;
      criteria: { true: string; false: string };
    };
    bid: {
      type: "choice";
      instructions: string;
      criteria: Record<string, string>;
    };
  };
};

export type JevDecision = {
  noul: number;
  choice: string;
  proposedBid: number | null;
};
