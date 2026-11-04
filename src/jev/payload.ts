import { LEGAL_BIDS, type AGENTS } from "../engine/model";
import { PROFILES } from "../profiles";
import type { JevPayload } from "./contract";

type Agent = (typeof AGENTS)[number];

export function buildJevPayload(agent: Agent): JevPayload {
  const profile = PROFILES[agent.id];

  return {
    model: "jev-1.13.0",
    state: {
      rules: {
        format: "sealed first-price",
        payment: "The highest bidder wins and pays their own bid.",
        legal_bid_ticks_usd: LEGAL_BIDS,
        overbidding: "A bid above private value is allowed.",
      },
      public: {
        bidder_count: 5,
        bids_are_sealed: true,
        other_bids_visible: false,
      },
      me: {
        agent_id: agent.id,
        private_value_usd: agent.value,
        profile: {
          label: profile.label,
          risk_attitude: profile.riskAttitude,
          competition_belief: profile.competitionBelief,
        },
      },
    },
    questions: {
      should_bid: {
        type: "noul",
        instructions:
          "Given the sealed first-price rules, `me.private_value_usd`, and the qualitative tendencies in `me.profile`, should this agent submit a bid rather than pass? A bid above private value is allowed. Do not calculate expected payoff.",
        criteria: {
          true: "Submit one of the legal dollar ticks.",
          false: "Pass and submit no bid.",
        },
      },
      bid: {
        type: "choice",
        instructions:
          "If this agent bids, which fixed legal dollar label should they submit in this sealed first-price auction, given `me.profile`? Choose only one listed label. Do not calculate or interpolate expected payoff. Choosing above `me.private_value_usd` is allowed.",
        criteria: Object.fromEntries(
          LEGAL_BIDS.map((bid) => [String(bid), `Bid $${bid}.`]),
        ),
      },
    },
  };
}
