import { AGENTS, type SettlementRow } from "./engine/model";
import { buildJevPayload } from "./jev/payload";
import { AuctionScene } from "./view/AuctionScene";
import { Hud } from "./view/Hud";
import { useAuctionRound } from "./view/use-auction-round";
import "./styles.css";

function App() {
  const auction = useAuctionRound();
  const complete = auction.settlement !== null;
  const rows: SettlementRow[] =
    auction.settlement?.rows ??
    AGENTS.map((agent) => ({
      agentId: agent.id,
      name: agent.name,
      value: agent.value,
      bid: null,
      payment: 0,
      payoff: 0,
    }));
  const payload = auction.currentAgent
    ? JSON.stringify(buildJevPayload(auction.currentAgent), null, 2)
    : "";

  return (
    <main className="app-shell">
      <section className="scene-panel" aria-label="Auction visualization">
        <div className="scene-heading">
          <span className="live-dot" aria-hidden="true" />
          <span>Five sealed agents</span>
          <span className="scene-rule">Highest legal bid · pays own bid</span>
        </div>
        <AuctionScene rows={rows} />
        <div className="scene-caption">
          <span>Private values are visible in god mode.</span>
          <span>Neutral columns reveal only after settlement.</span>
        </div>
      </section>

      <Hud
        key={auction.currentAgent?.id ?? "complete"}
        currentAgent={auction.currentAgent}
        payload={payload}
        rows={rows}
        jevByAgent={complete ? auction.jevByAgent : {}}
        winnerId={auction.settlement?.winnerId ?? null}
        error={auction.error}
        complete={complete}
        onCopy={(text) => void navigator.clipboard.writeText(text)}
        onSubmit={auction.submit}
        onReset={auction.reset}
      />
    </main>
  );
}

export default App;
