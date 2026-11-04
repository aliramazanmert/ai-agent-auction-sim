# AGENTS.md

## Repository boundary

This is the standalone `ai-agent-auction-sim` application. Keep all source,
dependencies, tests, and commits in this repository. Do not add this application
to Central Services or modify `/agent/repos/central-services`.

## Architecture

- `src/engine/` owns fixed agent values, legal-bid validation, bid recording,
  allocation, first-price payment, and payoff. It stays pure and imports no React,
  Three.js, browser, Jev, or HTTP code.
- `src/jev/` owns per-agent TypeSafe Jev payloads and parsing pasted playground
  responses. It may import engine types, but it owns no auction money rules.
- `src/view/` owns React orchestration, the DOM HUD, agent progression, and the
  React Three Fiber scene. It consumes `engine` and `jev`; it does not implement
  auction math or call TypeSafe over HTTP.
- `src/profiles.ts` is shared immutable configuration for qualitative profiles,
  accessible identity colors, and deferred motion vocabulary. It owns no behavior.
- Dependency direction is `view -> jev -> engine/model`, `view -> engine`, and
  `view/jev -> profiles -> engine/model`.
  Never import `view` from `engine` or `jev`, and never import `jev` from `engine`.

## File map

- `src/engine/model.ts`: fixed agents, legal ticks, and domain types.
- `src/engine/auction.ts`: pure bid recording and settlement rules.
- `src/profiles.ts`: stable profile beliefs, identity colors, and inert future-motion descriptors.
- `src/jev/contract.ts`: Jev request and parsed-decision types.
- `src/jev/payload.ts`: one private payload per active agent.
- `src/jev/parse-response.ts`: pasted JSON validation and Choice-to-dollar mapping.
- `src/jev/fixtures/`: deterministic pasted-response test fixtures.
- `src/view/use-auction-round.ts`: five-agent progression and reset behavior.
- `src/view/Hud.tsx`: payload copy, response paste, errors, and result table.
- `src/view/AuctionScene.tsx`: demand-rendered R3F disk, capsules, and bid columns.
- `tests/auction-round.spec.ts`: real-browser full-round smoke test.

## Commands

```bash
npm install
npm run dev
npm run test
npm run test:e2e
npm run typecheck
npm run lint
npm run build
```

## Testing expectations

- Use TDD for behavior changes: write a focused failing test, prove the failure,
  add the smallest implementation, then run the focused test and the relevant suite.
- Keep auction-rule and Jev-adapter tests free of WebGL.
- Cover DOM interactions with Testing Library, the scene tree with
  `@react-three/test-renderer`, and one complete five-agent browser round with
  Playwright.
- Assert stable profile-to-color mappings and visible profile labels with object
  and DOM semantics; do not use screenshot or pixel snapshots.
- Before a commit, run the relevant focused tests. Before handoff, run every
  command in the Commands section except `npm run dev`.

## Playground workflow

For Ana, Ben, Cam, Dee, and Eve in order, copy the active payload from the HUD,
run it in `https://console.typesafe.ai/playground`, paste the complete JSON
response into the HUD, and submit. All five agents must submit or skip before
allocation. A `should_bid` noul below `0.7` is a skip.

The only legal bid ticks are `20, 30, 40, 50, 60, 70, 80, 90, 100`.
Overbidding above private value is legal and can produce a negative payoff.
Every payload and HUD row keeps the agent's profile label, risk attitude, and
competition belief visible. With no assumed value distribution, do not call an
agent an equilibrium agent and do not ask Jev to calculate or interpolate
expected payoff. Jev chooses a fixed dollar label; code owns arithmetic and validation.

Profile color is an accessible identity cue paired with text. It never encodes
bid, value, winner, or payoff. Winner and negative payoff use separate semantic
channels. Tempo, easing, pulse, posture, and reveal are a deferred visual-personality
"wow" layer; v0 stores the vocabulary but implements no tendency animation.

## v0 integration boundary

Do not add a TypeSafe API key, `fetch` call, TypeSafe SDK, or
`POST /v1/systemone` integration. v0 is playground copy/paste only. HTTP and
autonomous-agent integration are deferred.
