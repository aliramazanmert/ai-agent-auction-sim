import { create } from "@react-three/test-renderer";
import type { Mesh, MeshStandardMaterial } from "three";
import { describe, expect, it } from "vitest";
import { AGENTS, type SettlementRow } from "../engine/model";
import { PROFILES } from "../profiles";
import { SceneContent } from "./AuctionScene";

const rows: SettlementRow[] = AGENTS.map((agent, index) => ({
  agentId: agent.id,
  name: agent.name,
  value: agent.value,
  bid: index === 0 ? 70 : null,
  payment: index === 0 ? 70 : 0,
  payoff: index === 0 ? 30 : 0,
}));

describe("SceneContent", () => {
  it("renders five capsules and five bid columns from row data", async () => {
    const renderer = await create(<SceneContent rows={rows} />);

    for (const agent of AGENTS) {
      expect(
        renderer.scene.findByProps({ name: `agent-${agent.id}` }),
      ).toBeDefined();
      expect(
        renderer.scene.findByProps({ name: `column-${agent.id}` }),
      ).toBeDefined();
    }
    expect(
      renderer.scene.findByProps({ name: "column-ana" }).props.scale,
    ).toEqual([0.55, 3.5, 0.55]);
    expect(
      renderer.scene.findByProps({ name: "column-ben" }).props.scale[1],
    ).toBe(0);
    const agentMaterial = (
      renderer.scene.findByProps({ name: "agent-ana" }).instance as Mesh
    ).material as MeshStandardMaterial;
    const columnMaterial = (
      renderer.scene.findByProps({ name: "column-ana" }).instance as Mesh
    ).material as MeshStandardMaterial;
    expect(`#${agentMaterial.color.getHexString().toUpperCase()}`).toBe(
      PROFILES.ana.color.hex,
    );
    expect(`#${columnMaterial.color.getHexString().toUpperCase()}`).toBe(
      "#90A4AE",
    );
  });
});
