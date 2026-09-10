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
  { label: "intent.received", value: "agent_07", Icon: Bot, x: "2%", y: "14%", opacity: 0.34, delay: "-2s", introX: "-22vw", introY: "-16vh", underlay: false },
  { label: "tool.completed", value: "market_data", Icon: Wrench, x: "8%", y: "46%", opacity: 0.3, delay: "-7s", introX: "-26vw", introY: "0vh", underlay: false },
  { label: "policy.allowed", value: "spend-limit-v4", Icon: ShieldCheck, x: "3%", y: "80%", opacity: 0.32, delay: "-11s", introX: "-22vw", introY: "16vh", underlay: false },
  { label: "wallet.signed", value: "$0.0118", Icon: Fingerprint, x: "86%", y: "14%", opacity: 0.32, delay: "-5s", introX: "22vw", introY: "-16vh", underlay: false },
  { label: "rpc.confirmed", value: "84ms", Icon: RadioTower, x: "90%", y: "46%", opacity: 0.3, delay: "-9s", introX: "26vw", introY: "0vh", underlay: false },
  { label: "outcome.verified", value: "score 97.4", Icon: CircleCheck, x: "87%", y: "80%", opacity: 0.34, delay: "-13s", introX: "22vw", introY: "16vh", underlay: false },
  { label: "trace.linked", value: "13 spans", Icon: Activity, x: "29%", y: "13%", opacity: 0.2, delay: "-6s", introX: "-12vw", introY: "-20vh", underlay: true },
  { label: "cost.attributed", value: "$0.0118", Icon: CircleDollarSign, x: "42%", y: "27%", opacity: 0.16, delay: "-4s", introX: "-8vw", introY: "-24vh", underlay: true },
  { label: "transaction.finalized", value: "2.81s", Icon: Blocks, x: "82%", y: "62%", opacity: 0.15, delay: "-10s", introX: "14vw", introY: "22vh", underlay: true },
] as const;

export function TelemetryBackdrop() {
  return (
    <div className="telemetry-backdrop" aria-hidden="true">
      <Activity className="ambient-glyph ambient-glyph--trace" size={18} strokeWidth={1.4} />
      <Blocks className="ambient-glyph ambient-glyph--blocks" size={18} strokeWidth={1.4} />
      {ambientCards.map(({ label, value, Icon, x, y, opacity, delay, introX, introY, underlay }, index) => (
        <div
          className={`ambient-node${underlay ? " ambient-node--underlay" : ""}`}
          key={label}
          style={{
            "--ambient-x": x,
            "--ambient-y": y,
            "--ambient-opacity": opacity,
            "--ambient-delay": delay,
            "--ambient-intro-x": introX,
            "--ambient-intro-y": introY,
            "--ambient-intro-delay": `${180 + index * 55}ms`,
          } as CSSProperties}
        >
          <div className="ambient-node__body">
            <Icon size={15} strokeWidth={1.6} />
            <span>
              <small>{label}</small>
              <strong>{value}</strong>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
