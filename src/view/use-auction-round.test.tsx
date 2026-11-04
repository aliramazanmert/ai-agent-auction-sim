import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ana from "../jev/fixtures/ana-response.json";
import ben from "../jev/fixtures/ben-response.json";
import cam from "../jev/fixtures/cam-response.json";
import dee from "../jev/fixtures/dee-response.json";
import eve from "../jev/fixtures/eve-response.json";
import { useAuctionRound } from "./use-auction-round";

describe("useAuctionRound", () => {
  it("does not advance on an unparseable paste", () => {
    const { result } = renderHook(() => useAuctionRound());
    act(() => result.current.submit("{"));

    expect(result.current.currentAgent?.id).toBe("ana");
    expect(result.current.error).toBe("Paste valid Jev response JSON.");
  });

  it("advances after a legal low-noul skip", () => {
    const { result } = renderHook(() => useAuctionRound());
    act(() => result.current.submit(JSON.stringify(eve)));

    expect(result.current.currentAgent?.id).toBe("ben");
    expect(result.current.round.decisions.ana).toEqual({
      submitted: true,
      bid: null,
    });
  });

  it("settles only after all five fixtures are submitted", () => {
    const { result } = renderHook(() => useAuctionRound());
    for (const fixture of [ana, ben, cam, dee, eve]) {
      act(() => result.current.submit(JSON.stringify(fixture)));
    }

    expect(result.current.currentAgent).toBeNull();
    expect(result.current.settlement?.winnerId).toBe("ben");
    expect(result.current.settlement?.rows[1]).toMatchObject({
      bid: 100,
      payment: 100,
      payoff: -20,
    });
  });

  it("resets to a clean Ana turn", () => {
    const { result } = renderHook(() => useAuctionRound());
    act(() => result.current.submit(JSON.stringify(ana)));
    act(() => result.current.reset());

    expect(result.current.currentAgent?.id).toBe("ana");
    expect(result.current.round.decisions.ana.submitted).toBe(false);
    expect(result.current.jevByAgent).toEqual({});
  });
});
