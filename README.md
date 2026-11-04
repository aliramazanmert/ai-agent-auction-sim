# Auction sim v0

One sealed first-price auction with five watch-only agents and visible qualitative
tendency profiles. The app builds a typed Jev payload for each agent; a human runs
it in the TypeSafe playground and pastes the response back. There is no HTTP or
API-key integration in v0.

## Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite and the
[TypeSafe Playground](https://console.typesafe.ai/playground).

For Ana, Ben, Cam, Dee, and Eve in order:

1. Confirm the HUD names the expected agent.
2. Confirm the payload and HUD show the expected profile label, risk attitude,
   and competition belief.
3. Click **Copy payload**.
4. Paste the complete payload into the playground and run it.
5. Confirm the response has `answers.should_bid.type = "noul"`,
   `answers.should_bid.noul` between 0 and 1,
   `answers.bid.type = "choice"`, and `answers.bid.choice` equal to one of
   `"20"`, `"30"`, `"40"`, `"50"`, `"60"`, `"70"`, `"80"`, `"90"`, or `"100"`.
6. Paste the complete response JSON into the HUD and click **Submit response**.
7. Confirm the app advances exactly one agent. A noul below `0.7` is a skip.

After Eve, confirm the app reveals one settled round with profile, value, bid,
payment, payoff, Jev noul, and Jev choice for every agent. Profile colors remain
identity-only and each has a text label. Winner has a separate badge/outline;
negative payoff has warning text/icon. An above-value winning bid is valid and may
show a negative payoff. Click **Reset** and confirm Ana is active with all bids
cleared.

## Checks

```bash
npm run test
npm run test:e2e
npm run typecheck
npm run lint
npm run build
```

## v0 boundary

The app does not contain a TypeSafe API key, call `fetch`, use the TypeSafe SDK,
or send an HTTP request. API-key and `POST /v1/systemone` integration are
deferred. No value distribution is assumed: do not call any agent an equilibrium
agent or ask Jev to calculate/interpolate expected payoff. The future
tempo/easing/pulse/posture/reveal visual-personality "wow" layer is deferred
beyond v0.
