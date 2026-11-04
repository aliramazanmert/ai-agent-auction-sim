import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AGENTS } from "../engine/model";
import { buildJevPayload } from "../jev/payload";
import { PROFILES } from "../profiles";
import { Hud } from "./Hud";

const props = {
  currentAgent: AGENTS[0],
  payload: JSON.stringify(buildJevPayload(AGENTS[0]), null, 2),
  rows: AGENTS.map((agent) => ({
    agentId: agent.id,
    name: agent.name,
    value: agent.value,
    bid: null,
    payment: 0,
    payoff: 0,
  })),
  jevByAgent: {},
  winnerId: null,
  error: null,
  complete: false,
  onCopy: vi.fn(),
  onSubmit: vi.fn(),
  onReset: vi.fn(),
};

describe("Hud", () => {
  it("copies the displayed payload", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<Hud {...props} onCopy={onCopy} />);

    await user.click(screen.getByRole("button", { name: "Copy payload" }));

    expect(onCopy).toHaveBeenCalledWith(props.payload);
  });

  it("submits the pasted response text", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Hud {...props} onSubmit={onSubmit} />);

    await user.click(screen.getByLabelText("Paste Jev response"));
    await user.paste('{"answers":{}}');
    await user.click(screen.getByRole("button", { name: "Submit response" }));

    expect(onSubmit).toHaveBeenCalledWith('{"answers":{}}');
  });

  it("shows a one-line error and active agent", () => {
    render(<Hud {...props} error="Paste valid Jev response JSON." />);

    expect(screen.getByText("Agent up: Ana")).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Paste valid Jev response JSON.",
    );
  });

  it("shows every profile label and qualitative tendency in a text legend", () => {
    render(<Hud {...props} />);
    const legend = screen.getByRole("region", {
      name: "Agent profile legend",
    });

    for (const profile of Object.values(PROFILES)) {
      expect(legend).toHaveTextContent(profile.label);
      expect(legend).toHaveTextContent(profile.riskAttitude);
      expect(legend).toHaveTextContent(
        `${profile.competitionBelief} competition`,
      );
    }
  });

  it("renders an overbid and negative payoff without marking it invalid", () => {
    const rows = props.rows.map((row) =>
      row.agentId === "ben"
        ? { ...row, bid: 100 as const, payment: 100, payoff: -20 }
        : row,
    );

    render(
      <Hud
        {...props}
        currentAgent={null}
        complete
        winnerId="ben"
        rows={rows}
      />,
    );

    expect(screen.getByText("Winner")).toBeVisible();
    expect(screen.getByLabelText("Negative payoff $-20")).toBeVisible();
  });
});
