import { describe, expect, it } from "vitest";
import { createRound, recordBid, settleRound } from "./auction";

describe("auction engine", () => {
  it("awards the highest bid and charges the winner their own bid", () => {
    let round = createRound();
    round = recordBid(round, "ana", 70);
    round = recordBid(round, "ben", 60);
    round = recordBid(round, "cam", null);
    round = recordBid(round, "dee", null);
    round = recordBid(round, "eve", null);

    const result = settleRound(round);

    expect(result?.winnerId).toBe("ana");
    expect(result?.rows.find((row) => row.agentId === "ana")).toMatchObject({
      value: 100,
      bid: 70,
      payment: 70,
      payoff: 30,
    });
  });

  it("allows overbidding and can produce a negative payoff", () => {
    let round = createRound();
    round = recordBid(round, "ana", 70);
    round = recordBid(round, "ben", 100);
    round = recordBid(round, "cam", null);
    round = recordBid(round, "dee", null);
    round = recordBid(round, "eve", null);

    const result = settleRound(round);

    expect(result?.winnerId).toBe("ben");
    expect(result?.rows.find((row) => row.agentId === "ben")).toMatchObject({
      bid: 100,
      payment: 100,
      payoff: -20,
    });
  });

  it("breaks equal maximum bids by fixed agent order", () => {
    let round = createRound();
    round = recordBid(round, "ana", 70);
    round = recordBid(round, "ben", 70);
    round = recordBid(round, "cam", null);
    round = recordBid(round, "dee", null);
    round = recordBid(round, "eve", null);

    expect(settleRound(round)?.winnerId).toBe("ana");
  });

  it("records an out-of-tick bid as no bid", () => {
    const round = recordBid(createRound(), "ana", 55);

    expect(round.decisions.ana).toEqual({ submitted: true, bid: null });
  });

  it("does not settle before every agent submits", () => {
    expect(settleRound(recordBid(createRound(), "ana", 70))).toBeNull();
  });

  it("settles with no winner when everyone skips", () => {
    let round = createRound();
    for (const id of ["ana", "ben", "cam", "dee", "eve"] as const) {
      round = recordBid(round, id, null);
    }

    const result = settleRound(round);
    expect(result?.winnerId).toBeNull();
    expect(
      result?.rows.every((row) => row.payment === 0 && row.payoff === 0),
    ).toBe(true);
  });
});
