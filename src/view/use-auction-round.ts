import { useState } from "react";
import { createRound, recordBid, settleRound } from "../engine/auction";
import { AGENTS, type AgentId, type Settlement } from "../engine/model";
import type { JevDecision } from "../jev/contract";
import { JevParseError, parseJevResponse } from "../jev/parse-response";

export function useAuctionRound() {
  const [round, setRound] = useState(createRound);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jevByAgent, setJevByAgent] = useState<
    Partial<Record<AgentId, JevDecision>>
  >({});
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentAgent = AGENTS[currentIndex] ?? null;

  function submit(raw: string) {
    if (!currentAgent) return;

    try {
      const decision = parseJevResponse(raw);
      const nextRound = recordBid(
        round,
        currentAgent.id,
        decision.proposedBid,
      );

      setRound(nextRound);
      setJevByAgent((current) => ({
        ...current,
        [currentAgent.id]: decision,
      }));
      setError(null);
      if (currentIndex === AGENTS.length - 1) {
        setSettlement(settleRound(nextRound));
      }
      setCurrentIndex((index) => index + 1);
    } catch (caught) {
      setError(
        caught instanceof JevParseError
          ? caught.message
          : "The pasted response could not be submitted.",
      );
    }
  }

  function reset() {
    setRound(createRound());
    setCurrentIndex(0);
    setJevByAgent({});
    setSettlement(null);
    setError(null);
  }

  return {
    round,
    currentAgent,
    currentIndex,
    jevByAgent,
    settlement,
    error,
    submit,
    reset,
  };
}
