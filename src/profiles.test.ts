import { describe, expect, it } from "vitest";
import { PROFILES } from "./profiles";

describe("agent profiles", () => {
  it("keeps profile labels and accessible identity colors stable", () => {
    expect(
      Object.fromEntries(
        Object.entries(PROFILES).map(([id, profile]) => [
          id,
          { label: profile.label, color: profile.color.hex },
        ]),
      ),
    ).toEqual({
      ana: { label: "Guarded Competitor", color: "#0072B2" },
      ben: { label: "Bold Competitor", color: "#D55E00" },
      cam: { label: "Measured Realist", color: "#009E73" },
      dee: { label: "Cautious Opportunist", color: "#CC79A7" },
      eve: { label: "Bold Optimist", color: "#E69F00" },
    });
  });

  it("distinguishes risk attitude and competition belief", () => {
    expect(PROFILES.ana).toMatchObject({
      riskAttitude: "cautious",
      competitionBelief: "strong",
    });
    expect(PROFILES.ben).toMatchObject({
      riskAttitude: "bold",
      competitionBelief: "strong",
    });
    expect(PROFILES.cam).toMatchObject({
      riskAttitude: "balanced",
      competitionBelief: "moderate",
    });
    expect(PROFILES.dee).toMatchObject({
      riskAttitude: "cautious",
      competitionBelief: "weak",
    });
    expect(PROFILES.eve).toMatchObject({
      riskAttitude: "bold",
      competitionBelief: "weak",
    });
  });

  it("reserves a complete future motion vocabulary without using it in v0", () => {
    for (const profile of Object.values(PROFILES)) {
      expect(Object.keys(profile.futureMotion).sort()).toEqual([
        "easing",
        "posture",
        "pulse",
        "reveal",
        "tempo",
      ]);
    }
  });
});
