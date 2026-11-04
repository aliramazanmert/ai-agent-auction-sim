import {
  AGENTS,
  LEGAL_BIDS,
  type AgentId,
  type LegalBid,
  type RoundState,
  type Settlement,
} from "./model";

const emptyDecision = () => ({ submitted: false, bid: null });

export function createRound(): RoundState {
  return {
    decisions: {
      ana: emptyDecision(),
      ben: emptyDecision(),
      cam: emptyDecision(),
      dee: emptyDecision(),
      eve: emptyDecision(),
    },
  };
}

export function isLegalBid(value: number): value is LegalBid {
  return LEGAL_BIDS.includes(value as LegalBid);
}

export function recordBid(
  round: RoundState,
  agentId: AgentId,
  proposedBid: number | null,
): RoundState {
  if (round.decisions[agentId].submitted) {
    throw new Error(`${agentId} already submitted`);
  }

  const bid =
    proposedBid !== null && isLegalBid(proposedBid) ? proposedBid : null;

  return {
    decisions: {
      ...round.decisions,
      [agentId]: { submitted: true, bid },
    },
  };
}

export function settleRound(round: RoundState): Settlement | null {
  if (AGENTS.some((agent) => !round.decisions[agent.id].submitted)) {
    return null;
  }

  const winner = AGENTS.reduce<(typeof AGENTS)[number] | null>((best, agent) => {
    const bid = round.decisions[agent.id].bid;
    if (bid === null) return best;
    if (best === null) return agent;
    const bestBid = round.decisions[best.id].bid as LegalBid;
    return bid > bestBid ? agent : best;
  }, null);

  return {
    winnerId: winner?.id ?? null,
    rows: AGENTS.map((agent) => {
      const bid = round.decisions[agent.id].bid;
      const won = agent.id === winner?.id;
      const payment = won && bid !== null ? bid : 0;

      return {
        agentId: agent.id,
        name: agent.name,
        value: agent.value,
        bid,
        payment,
        payoff: won ? agent.value - payment : 0,
      };
    }),
  };
}
