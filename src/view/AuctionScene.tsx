import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AGENTS, type SettlementRow } from "../engine/model";
import { PROFILES } from "../profiles";

export function SceneContent({ rows }: { rows: SettlementRow[] }) {
  return (
    <>
      <color attach="background" args={["#090f14"]} />
      <fog attach="fog" args={["#090f14", 10, 22]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 8, 5]} intensity={2} />
      <mesh name="auction-disk" position={[0, -0.35, 0]}>
        <cylinderGeometry args={[5.2, 5.2, 0.5, 48]} />
        <meshStandardMaterial color="#263238" />
      </mesh>

      {AGENTS.map((agent, index) => {
        const profile = PROFILES[agent.id];
        const angle = (index / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * 3.7;
        const z = Math.sin(angle) * 3.7;
        const row = rows.find((candidate) => candidate.agentId === agent.id);
        const height = (row?.bid ?? 0) / 20;

        return (
          <group key={agent.id} position={[x, 0, z]}>
            <mesh name={`agent-${agent.id}`} position={[0, 0.8, 0]}>
              <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
              <meshStandardMaterial
                color={profile.color.hex}
                roughness={0.48}
                metalness={0.08}
              />
            </mesh>

            <mesh
              name={`column-${agent.id}`}
              position={[0, height / 2, -0.9]}
              scale={[0.55, height, 0.55]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#90A4AE" />
            </mesh>

            <Html
              position={[0, 1.8, 0]}
              center
              style={{ pointerEvents: "none" }}
            >
              <span className="scene-label">
                <strong>{agent.name}</strong>
                <small>{profile.label}</small>
              </span>
            </Html>

            {row?.bid !== null && row?.bid !== undefined && (
              <Html
                position={[0, Math.max(height + 0.25, 0.4), -0.9]}
                center
                style={{ pointerEvents: "none" }}
              >
                <span className="bid-label">${row.bid}</span>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

export function AuctionScene({ rows }: { rows: SettlementRow[] }) {
  return (
    <Canvas
      aria-label="Auction scene"
      frameloop="demand"
      orthographic
      camera={{ position: [8, 9, 10], zoom: 55 }}
    >
      <SceneContent rows={rows} />
    </Canvas>
  );
}
