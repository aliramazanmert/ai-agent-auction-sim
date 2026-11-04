import { useState } from "react";
import type { AgentId, SettlementRow } from "../engine/model";
import type { JevDecision } from "../jev/contract";
import { PROFILES } from "../profiles";

type Agent = {
  readonly id: AgentId;
  readonly name: string;
  readonly value: number;
};

type Props = {
  currentAgent: Agent | null;
  payload: string;
  rows: SettlementRow[];
  jevByAgent: Partial<Record<AgentId, JevDecision>>;
  winnerId: AgentId | null;
  error: string | null;
  complete: boolean;
  onCopy: (payload: string) => void;
  onSubmit: (raw: string) => void;
  onReset: () => void;
};

const money = (value: number) => `$${value}`;

export function Hud(props: Props) {
  const [raw, setRaw] = useState("");

  return (
    <section className="hud" aria-label="Auction control panel">
      <header className="hud-header">
        <div>
          <p className="eyebrow">Jev playground · manual bridge</p>
          <h1>Sealed first-price auction</h1>
        </div>
        <strong className="round-status">
          {props.currentAgent
            ? `Agent up: ${props.currentAgent.name}`
            : "Round complete"}
        </strong>
      </header>

      <section
        aria-label="Agent profile legend"
        className="profile-legend"
      >
        {Object.entries(PROFILES).map(([id, profile]) => (
          <div className="profile-card" key={id}>
            <span
              aria-hidden="true"
              className="profile-swatch"
              style={{ backgroundColor: profile.color.hex }}
            />
            <span>
              <strong>{profile.label}</strong>
              <small>
                {profile.riskAttitude} · {profile.competitionBelief} competition
              </small>
            </span>
          </div>
        ))}
      </section>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Profile</th>
              <th>Value</th>
              <th>Bid</th>
              <th>Payment</th>
              <th>Payoff</th>
              <th>Jev noul</th>
              <th>Jev choice</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((row) => {
              const jev = props.jevByAgent[row.agentId];
              const profile = PROFILES[row.agentId];

              return (
                <tr key={row.agentId}>
                  <th scope="row">
                    <span className="agent-name">{row.name}</span>
                    {props.winnerId === row.agentId && (
                      <strong className="winner-badge">Winner</strong>
                    )}
                  </th>
                  <td>
                    <span
                      aria-hidden="true"
                      className="profile-swatch"
                      style={{ backgroundColor: profile.color.hex }}
                    />
                    <span className="profile-cell-copy">
                      <strong>{profile.label}</strong>
                      <small>
                        {profile.riskAttitude} · {profile.competitionBelief}{" "}
                        competition
                      </small>
                    </span>
                  </td>
                  <td>{money(row.value)}</td>
                  <td>{row.bid === null ? "—" : money(row.bid)}</td>
                  <td>{money(row.payment)}</td>
                  <td>
                    {row.payoff < 0 ? (
                      <span
                        className="negative-payoff"
                        aria-label={`Negative payoff ${money(row.payoff)}`}
                      >
                        ⚠ {money(row.payoff)}
                      </span>
                    ) : (
                      money(row.payoff)
                    )}
                  </td>
                  <td>{jev?.noul ?? "—"}</td>
                  <td>{jev?.choice ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {props.currentAgent && (
        <div className="exchange">
          <div className="exchange-step">
            <span className="step-number">1</span>
            <label>
              Payload for {props.currentAgent.name}
              <textarea readOnly value={props.payload} rows={16} />
            </label>
            <button
              className="secondary-button"
              type="button"
              onClick={() => props.onCopy(props.payload)}
            >
              Copy payload
            </button>
          </div>

          <div className="exchange-step">
            <span className="step-number">2</span>
            <label>
              Paste Jev response
              <textarea
                value={raw}
                onChange={(event) => setRaw(event.target.value)}
                placeholder='{"model":"jev-1.13.0","answers":{...}}'
                rows={10}
              />
            </label>
            <button
              className="primary-button"
              type="button"
              onClick={() => props.onSubmit(raw)}
            >
              Submit response
            </button>
          </div>
        </div>
      )}

      {props.error && <p role="alert">{props.error}</p>}

      <footer className="hud-footer">
        <span>
          {props.complete
            ? "All sealed bids are revealed."
            : "Bids stay sealed until every agent submits."}
        </span>
        <button
          className="text-button"
          type="button"
          onClick={props.onReset}
        >
          Reset
        </button>
      </footer>
    </section>
  );
}
