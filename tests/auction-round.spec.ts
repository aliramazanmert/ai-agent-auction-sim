import { expect, test } from "@playwright/test";
import ana from "../src/jev/fixtures/ana-response.json" with { type: "json" };
import ben from "../src/jev/fixtures/ben-response.json" with { type: "json" };
import cam from "../src/jev/fixtures/cam-response.json" with { type: "json" };
import dee from "../src/jev/fixtures/dee-response.json" with { type: "json" };
import eve from "../src/jev/fixtures/eve-response.json" with { type: "json" };

test("completes one five-agent round with a live WebGL canvas", async ({
  page,
}) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));
  await page.goto("/");

  await expect(page.getByLabel("Auction scene")).toBeVisible();
  for (const [name, fixture] of [
    ["Ana", ana],
    ["Ben", ben],
    ["Cam", cam],
    ["Dee", dee],
    ["Eve", eve],
  ] as const) {
    await expect(page.getByText(`Agent up: ${name}`)).toBeVisible();
    await page.getByLabel("Paste Jev response").fill(JSON.stringify(fixture));
    await page
      .getByRole("button", { name: "Submit response" })
      .click();
  }

  await expect(page.getByText("Round complete")).toBeVisible();
  const legend = page.getByRole("region", { name: "Agent profile legend" });
  for (const label of [
    "Guarded Competitor",
    "Bold Competitor",
    "Measured Realist",
    "Cautious Opportunist",
    "Bold Optimist",
  ]) {
    await expect(legend).toContainText(label);
  }

  const benRow = page.getByRole("row").filter({ hasText: "Ben" });
  await expect(benRow).toContainText("$80");
  await expect(benRow).toContainText("$100");
  await expect(benRow.getByText("Winner")).toBeVisible();
  await expect(benRow.getByLabel("Negative payoff $-20")).toBeVisible();
  const eveRow = page.getByRole("row").filter({ hasText: "Eve" });
  await expect(eveRow).toContainText("0.42");
  await expect(eveRow).toContainText("30");
  expect(pageErrors).toEqual([]);

  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.getByText("Agent up: Ana")).toBeVisible();
});
