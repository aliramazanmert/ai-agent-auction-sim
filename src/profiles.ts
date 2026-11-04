import type { AgentId } from "./engine/model";

type AgentProfile = {
  label: string;
  riskAttitude: "cautious" | "balanced" | "bold";
  competitionBelief: "strong" | "moderate" | "weak";
  color: { name: string; hex: `#${string}` };
  futureMotion: {
    tempo: string;
    easing: string;
    pulse: string;
    posture: string;
    reveal: string;
  };
};

export const PROFILES: Record<AgentId, AgentProfile> = {
  ana: {
    label: "Guarded Competitor",
    riskAttitude: "cautious",
    competitionBelief: "strong",
    color: { name: "blue", hex: "#0072B2" },
    futureMotion: {
      tempo: "deliberate",
      easing: "ease-in-out",
      pulse: "restrained",
      posture: "guarded",
      reveal: "measured",
    },
  },
  ben: {
    label: "Bold Competitor",
    riskAttitude: "bold",
    competitionBelief: "strong",
    color: { name: "vermillion", hex: "#D55E00" },
    futureMotion: {
      tempo: "quick",
      easing: "ease-out",
      pulse: "sharp",
      posture: "forward",
      reveal: "snap",
    },
  },
  cam: {
    label: "Measured Realist",
    riskAttitude: "balanced",
    competitionBelief: "moderate",
    color: { name: "bluish green", hex: "#009E73" },
    futureMotion: {
      tempo: "steady",
      easing: "linear",
      pulse: "even",
      posture: "neutral",
      reveal: "clear",
    },
  },
  dee: {
    label: "Cautious Opportunist",
    riskAttitude: "cautious",
    competitionBelief: "weak",
    color: { name: "reddish purple", hex: "#CC79A7" },
    futureMotion: {
      tempo: "deliberate",
      easing: "ease-in",
      pulse: "soft",
      posture: "reserved",
      reveal: "late",
    },
  },
  eve: {
    label: "Bold Optimist",
    riskAttitude: "bold",
    competitionBelief: "weak",
    color: { name: "orange", hex: "#E69F00" },
    futureMotion: {
      tempo: "quick",
      easing: "spring-like",
      pulse: "bright",
      posture: "open",
      reveal: "early",
    },
  },
};
