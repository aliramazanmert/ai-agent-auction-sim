import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ana from "./jev/fixtures/ana-response.json";

vi.mock("./view/AuctionScene", () => ({
  AuctionScene: () => <div data-testid="auction-scene" />,
}));

import App from "./App";

describe("App", () => {
  it("shows Ana's private payload and advances to Ben after a valid paste", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Agent up: Ana")).toBeVisible();
    expect(screen.getByDisplayValue(/"agent_id": "ana"/)).toBeVisible();
    expect(
      screen.getByDisplayValue(/"label": "Guarded Competitor"/),
    ).toBeVisible();
    expect(
      screen.getAllByText("Guarded Competitor").length,
    ).toBeGreaterThan(0);

    await user.click(screen.getByLabelText("Paste Jev response"));
    await user.paste(JSON.stringify(ana));
    await user.click(
      screen.getByRole("button", { name: "Submit response" }),
    );

    expect(screen.getByText("Agent up: Ben")).toBeVisible();
    expect(screen.getByDisplayValue(/"agent_id": "ben"/)).toBeVisible();
    expect(screen.getByRole("row", { name: /Ana/ })).not.toHaveTextContent(
      "$70",
    );
  });
});
