import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";

export const consoleCaptures = [
  ["overview", "Overview", "Fleet health, operations and cost signals"],
  ["traces", "Traces", "Searchable causal execution records"],
  ["trace-detail", "Trace detail", "Intent-to-outcome waterfall evidence"],
  ["causal-graph", "Causal graph", "Every cross-system edge in one view"],
  ["agents", "Agents", "Fleet reliability and execution quality"],
  ["agent-detail", "Agent detail", "Identity, economics and linked evidence"],
  ["transactions", "Transactions", "Finality and transaction outcomes"],
  ["payments", "Payments", "Authorization, settlement and receipts"],
  ["rpc", "RPC", "Provider latency and request health"],
  ["contracts", "Contracts", "Methods, chains and observed state"],
  ["guard", "Guard", "Protection posture and live decisions"],
  ["policies", "Policies", "Policy authoring and simulation"],
  ["approvals", "Approvals", "Human review for bounded execution"],
  ["scores", "Scores", "Evidence-based fleet reliability"],
  ["erc-8004", "ERC-8004", "Identity resolution and reputation variance"],
  ["score-detail", "Score detail", "Dimensions, confidence and model evidence"],
  ["slos", "SLOs", "Error budgets across critical objectives"],
  ["incidents", "Incidents", "Root cause and recovery timeline"],
  ["costs", "Costs", "Agent and infrastructure FinOps"],
  ["integrations", "Integrations", "Framework and provider adapters"],
  ["api-keys", "API keys", "Scoped environment credentials"],
  ["otel", "OpenTelemetry", "Telemetry pipeline and semantic coverage"],
  ["settings", "Settings", "Workspace-wide operational preferences"],
  ["onboarding", "Onboarding", "First trace setup workflow"],
] as const;

export function ConsoleGallery() {
  const visibleCount = 4;
  const visibleCaptures = consoleCaptures.slice(0, visibleCount);
  const hiddenCount = consoleCaptures.length - visibleCount;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const close = () => setActiveIndex(null);
  const move = (direction: number) => setActiveIndex((current) => current === null ? null : (current + direction + consoleCaptures.length) % consoleCaptures.length);
  const open = (index: number) => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setActiveIndex(index);
  };
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const root = document.getElementById("root");
    document.body.style.overflow = "hidden";
    if (root) {
      root.inert = true;
      root.setAttribute("aria-hidden", "true");
    }
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + consoleCaptures.length) % consoleCaptures.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % consoleCaptures.length);
      if (event.key === "Tab" && dialogRef.current) {
        const controls = [...dialogRef.current.querySelectorAll<HTMLElement>("button")];
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      if (root) {
        root.inert = false;
        root.removeAttribute("aria-hidden");
      }
      window.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus();
    };
  }, [isOpen]);

  const active = activeIndex === null ? null : consoleCaptures[activeIndex];
  return (
    <>
      <div className="capture-grid">
        {visibleCaptures.map(([slug, title, description], index) => (
          <figure className={`capture capture--${index + 1} ${index === 0 ? "capture--lead" : ""}`} key={slug}>
            <button type="button" className="capture-open" onClick={() => open(index)} aria-label={`Open ${title} screenshot`}>
              <img src={`/images/console-${slug}.png`} alt={`ChainOps ${title} console`} loading="eager" />
            </button>
            <figcaption><span>{String(index + 1).padStart(2, "0")} / {title}</span><strong>{description}</strong></figcaption>
            {index === visibleCount - 1 && (
              <button type="button" className="capture-more" onClick={() => open(visibleCount)} aria-label={`Open ${hiddenCount} more Console screenshots`}>
                <Plus size={25} />
                <strong>{hiddenCount}</strong>
                <span>more views</span>
              </button>
            )}
          </figure>
        ))}
      </div>
      {active && activeIndex !== null && createPortal(
        <div className="gallery-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section ref={dialogRef} className="gallery-dialog" role="dialog" aria-modal="true" aria-label={`${active[1]} screenshot`} tabIndex={-1}>
            <div className="gallery-toolbar">
              <div><span>{String(activeIndex + 1).padStart(2, "0")} / {consoleCaptures.length}</span><strong>{active[1]}</strong><small>{active[2]}</small></div>
              <button type="button" onClick={close} aria-label="Close slideshow"><X size={20} /></button>
            </div>
            <img src={`/images/console-${active[0]}.png`} alt={`Expanded ChainOps ${active[1]} console`} />
            <button type="button" className="gallery-arrow gallery-arrow--previous" onClick={() => move(-1)} aria-label="Previous screenshot"><ArrowLeft size={21} /></button>
            <button type="button" className="gallery-arrow gallery-arrow--next" onClick={() => move(1)} aria-label="Next screenshot"><ArrowRight size={21} /></button>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
