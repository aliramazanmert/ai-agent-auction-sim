import type { JevDecision } from "./contract";

export class JevParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JevParseError";
  }
}

function record(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new JevParseError(`Missing or invalid ${field}`);
  }

  return value as Record<string, unknown>;
}

export function parseJevResponse(raw: string): JevDecision {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new JevParseError("Paste valid Jev response JSON.");
  }

  const root = record(parsed, "response");
  const answers = record(root.answers, "answers");
  const shouldBid = record(answers.should_bid, "answers.should_bid");
  const bid = record(answers.bid, "answers.bid");

  if (
    shouldBid.type !== "noul" ||
    typeof shouldBid.noul !== "number" ||
    shouldBid.noul < 0 ||
    shouldBid.noul > 1
  ) {
    throw new JevParseError("Missing or invalid answers.should_bid.");
  }

  if (bid.type !== "choice" || typeof bid.choice !== "string") {
    throw new JevParseError("Missing or invalid answers.bid.");
  }

  const proposedBid = Number(bid.choice);
  if (!Number.isInteger(proposedBid)) {
    throw new JevParseError("Jev bid choice must be a dollar integer.");
  }

  return {
    noul: shouldBid.noul,
    choice: bid.choice,
    proposedBid: shouldBid.noul >= 0.7 ? proposedBid : null,
  };
}
