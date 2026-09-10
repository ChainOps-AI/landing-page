import type { CSSProperties } from "react";
import {
  Activity,
  Blocks,
  Bot,
  CircleCheck,
  CircleDollarSign,
  Fingerprint,
  RadioTower,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const ambientCards = [
  { label: "intent.received", value: "agent_07", Icon: Bot, x: "2%", y: "14%", opacity: 0.34, delay: "-2s", underlay: false },
  { label: "tool.completed", value: "market_data", Icon: Wrench, x: "8%", y: "46%", opacity: 0.3, delay: "-7s", underlay: false },
  { label: "policy.allowed", value: "spend-limit-v4", Icon: ShieldCheck, x: "3%", y: "80%", opacity: 0.32, delay: "-11s", underlay: false },
  { label: "wallet.signed", value: "$0.0118", Icon: Fingerprint, x: "86%", y: "14%", opacity: 0.32, delay: "-5s", underlay: false },
  { label: "rpc.confirmed", value: "84ms", Icon: RadioTower, x: "90%", y: "46%", opacity: 0.3, delay: "-9s", underlay: false },
  { label: "outcome.verified", value: "score 97.4", Icon: CircleCheck, x: "87%", y: "80%", opacity: 0.34, delay: "-13s", underlay: false },
  { label: "cost.attributed", value: "$0.0118", Icon: CircleDollarSign, x: "42%", y: "27%", opacity: 0.16, delay: "-4s", underlay: true },
  { label: "transaction.finalized", value: "2.81s", Icon: Blocks, x: "82%", y: "62%", opacity: 0.15, delay: "-10s", underlay: true },
] as const;

export function TelemetryBackdrop() {
  return (
    <div className="telemetry-backdrop" aria-hidden="true">
      <Activity className="ambient-glyph ambient-glyph--trace" size={18} strokeWidth={1.4} />
      <Blocks className="ambient-glyph ambient-glyph--blocks" size={18} strokeWidth={1.4} />
      {ambientCards.map(({ label, value, Icon, x, y, opacity, delay, underlay }) => (
        <div
          className={`ambient-node${underlay ? " ambient-node--underlay" : ""}`}
          key={label}
          style={{
            "--ambient-x": x,
            "--ambient-y": y,
            "--ambient-opacity": opacity,
            "--ambient-delay": delay,
          } as CSSProperties}
        >
          <Icon size={15} strokeWidth={1.6} />
          <span>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}
