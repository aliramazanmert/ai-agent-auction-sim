import { describe, expect, it } from "vitest";
import ana from "./fixtures/ana-response.json";
import eve from "./fixtures/eve-response.json";
import { JevParseError, parseJevResponse } from "./parse-response";

describe("parseJevResponse", () => {
  it("maps a high-noul choice to a proposed dollar bid", () => {
    expect(parseJevResponse(JSON.stringify(ana))).toEqual({
      noul: 0.93,
      choice: "70",
      proposedBid: 70,
    });
  });

  it("maps a noul below 0.7 to a skip even when choice exists", () => {
    expect(parseJevResponse(JSON.stringify(eve))).toEqual({
      noul: 0.42,
      choice: "30",
      proposedBid: null,
    });
  });

  it("passes a parseable out-of-set number to the engine for rejection", () => {
    const raw = JSON.stringify({
      answers: {
        should_bid: { type: "noul", noul: 0.9 },
        bid: { type: "choice", choice: "110" },
      },
    });

    expect(parseJevResponse(raw).proposedBid).toBe(110);
  });

  it.each([
    ["bad JSON", "{"],
    ["missing answers", JSON.stringify({ model: "jev-1.13.0" })],
    [
      "missing bid answer",
      JSON.stringify({
        answers: { should_bid: { type: "noul", noul: 0.9 } },
      }),
    ],
    [
      "unparseable bid",
      JSON.stringify({
        answers: {
          should_bid: { type: "noul", noul: 0.9 },
          bid: { type: "choice", choice: "banana" },
        },
      }),
    ],
  ])("rejects %s", (_label, raw) => {
    expect(() => parseJevResponse(raw)).toThrow(JevParseError);
  });
});
