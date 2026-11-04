import { describe, expect, it } from "vitest";
import { AGENTS, LEGAL_BIDS } from "../engine/model";
import { PROFILES } from "../profiles";
import { buildJevPayload } from "./payload";

describe("buildJevPayload", () => {
  it.each(AGENTS)("builds private state only for $name", (agent) => {
    const payload = buildJevPayload(agent);
    const serialized = JSON.stringify(payload);

    expect(payload.model).toBe("jev-1.13.0");
    expect(payload.state.me).toEqual({
      agent_id: agent.id,
      private_value_usd: agent.value,
      profile: {
        label: PROFILES[agent.id].label,
        risk_attitude: PROFILES[agent.id].riskAttitude,
        competition_belief: PROFILES[agent.id].competitionBelief,
      },
    });
    expect(payload.state.rules.legal_bid_ticks_usd).toEqual(LEGAL_BIDS);
    expect(Object.keys(payload.questions.bid.criteria)).toEqual(
      LEGAL_BIDS.map(String),
    );
    for (const other of AGENTS.filter(
      (candidate) => candidate.id !== agent.id,
    )) {
      expect(serialized).not.toContain(`"agent_id":"${other.id}"`);
      expect(payload.state).not.toHaveProperty(other.id);
    }
    expect(serialized).not.toContain("futureMotion");
    expect(serialized).not.toContain(PROFILES[agent.id].color.hex);
  });

  it("uses fixed labels, allows overbidding, and refuses expected-payoff math", () => {
    const payload = buildJevPayload(AGENTS[0]);
    expect(payload.state.rules.overbidding).toContain("allowed");
    expect(payload.questions.bid.instructions).toContain("above");
    expect(payload.questions.bid.instructions).toContain(
      "fixed legal dollar label",
    );
    expect(payload.questions.bid.instructions).toContain(
      "Do not calculate or interpolate expected payoff",
    );
    expect(JSON.stringify(payload)).not.toContain("equilibrium");
  });
});
