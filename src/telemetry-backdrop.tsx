import { Activity, Blocks, Bot, CircleDollarSign, RadioTower, ShieldCheck } from "lucide-react";

const nodes = [
  ["agent", "agent_07", Bot],
  ["guard", "policy allow", ShieldCheck],
  ["rpc", "84ms", RadioTower],
  ["chain", "block 21.4M", Blocks],
] as const;

export function TelemetryBackdrop() {
  return (
    <div className="telemetry-backdrop" aria-hidden="true">
      <div className="telemetry-backdrop__mesh">
        <i className="mesh-link mesh-link--one" />
        <i className="mesh-link mesh-link--two" />
        <i className="mesh-link mesh-link--three" />
        {nodes.map(([className, label, Icon]) => (
          <div className={`mesh-node mesh-node--${className}`} key={className}>
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
          </div>
        ))}
        <div className="mesh-metric mesh-metric--cost"><CircleDollarSign size={13} /> cost $0.0118</div>
        <div className="mesh-metric mesh-metric--latency"><Activity size={13} /> latency 84ms</div>
        <div className="mesh-metric mesh-metric--finality">finality 2.81s</div>
      </div>
    </div>
  );
}

