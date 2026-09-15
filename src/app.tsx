import { useEffect, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import {
  Activity,
  ArrowRight,
  Blocks,
  Bot,
  Check,
  CircleCheck,
  Code2,
  Gauge,
  Layers3,
  Menu,
  Moon,
  Radar,
  RadioTower,
  Route,
  Server,
  ShieldCheck,
  Star,
  Sun,
  Waypoints,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { ConsoleGallery } from "./console-gallery";
import { CookieConsent } from "./cookie-consent";
import { ScrollToTop, useScrollReveals } from "./scroll-effects";
import { TelemetryBackdrop } from "./telemetry-backdrop";

const navigation = [
  ["Platform", "#platform"],
  ["Console", "#console"],
  ["Architecture", "#architecture"],
  ["Roadmap", "#roadmap"],
  ["Vision", "#vision"],
] as const;

const architectureSteps = [
  ["Agent runtimes", "LangGraph, Olas, Agentverse, Virtuals and custom stacks", Bot],
  ["SDK + Adapter", "OTLP telemetry and lifecycle commands through one neutral contract", Waypoints],
  ["Trace · Guard · Score", "Evidence, policy and trust services with an optional runtime layer", Layers3],
  ["Provider fabric", "Identity, wallets, payments, RPC and EVM chains stay pluggable", Server],
] as const;

const roadmap = [
  ["P0", "Foundation", "0–4 weeks", "Stable semantics and one reproducible local trace"],
  ["P1", "Trace", "6–10 weeks", "External developers produce useful causal traces and verified outcomes"],
  ["P2", "Guard", "8–12 weeks", "Policies prevent or escalate real execution risk"],
  ["P3", "Score", "10–16 weeks", "Trust becomes stable, explainable and used in decisions"],
  ["P4", "Runtime", "12–20 weeks", "Lifecycle demand proves safe reconcile and recovery workflows"],
  ["P5", "Control Plane", "Evidence gated", "Ecosystems depend on shared operational contracts"],
] as const;

const traceBoundaries = [
  ["Intent", Bot],
  ["Tool", Wrench],
  ["Guard", ShieldCheck],
  ["RPC", RadioTower],
  ["Outcome", CircleCheck],
] as const;

function Brand() {
  return (
    <span className="brand" aria-label="ChainOps">
      <img className="brand-mark brand-mark--dark" src="/logo-dark.svg" alt="" aria-hidden="true" />
      <img className="brand-mark brand-mark--light" src="/logo-light.svg" alt="" aria-hidden="true" />
      <span>
        Chain<strong>Ops</strong>
      </span>
    </span>
  );
}

function setThemeFavicon(theme: "dark" | "light") {
  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (favicon) favicon.href = theme === "light" ? "/logo-light.svg?v=10" : "/logo-dark.svg?v=10";
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.77c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2H21l-6.03 6.9L22.06 22H16.5l-4.35-5.69L7.18 22H4.41l6.45-7.37L4.06 2h5.7l3.93 5.2L18.24 2Zm-.97 17.7h1.53L8.93 4.18H7.29L17.27 19.7Z" />
    </svg>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try { window.localStorage.setItem("chainops-landing-theme", nextTheme); } catch { /* Theme still applies for this visit. */ }
  };

  useEffect(() => {
    setThemeFavicon(theme);
  }, [theme]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-link" href="#top" aria-label="ChainOps home">
          <Brand />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="header-socials" aria-label="ChainOps social links">
            <a className="social-link" href="https://x.com/ChainOps-AI" target="_blank" rel="noopener noreferrer" title="ChainOps on X" aria-label="ChainOps on X"><XMark /></a>
            <a className="social-link social-link--github" href="https://github.com/ChainOps-AI" target="_blank" rel="noopener noreferrer" title="ChainOps on GitHub" aria-label="ChainOps on GitHub"><GitHubMark /><Star size={11} /></a>
          </div>
          <button
            className="theme-button"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a className="header-cta" href="#contact">
            Contact us <ArrowRight size={16} />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label} <ArrowRight size={16} />
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact us <ArrowRight size={16} />
          </a>
        </nav>
      )}
    </header>
  );
}

function OperationSurface() {
  const stages = [
    ["Intent", Bot],
    ["Tool", Wrench],
    ["Guard", ShieldCheck],
    ["Transaction", Blocks],
    ["Outcome", CircleCheck],
  ] as const;

  const updateTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const surface = event.currentTarget;
    const bounds = surface.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
    surface.style.setProperty("--tilt-x", `${((0.5 - y) * 6).toFixed(2)}deg`);
    surface.style.setProperty("--tilt-y", `${((x - 0.5) * 7).toFixed(2)}deg`);
    surface.style.setProperty("--surface-x", `${(x * 100).toFixed(1)}%`);
    surface.style.setProperty("--surface-y", `${(y * 100).toFixed(1)}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--surface-x", "50%");
    event.currentTarget.style.setProperty("--surface-y", "50%");
  };

  return (
    <div
      className="operation-surface"
      aria-label="ChainOps autonomous operation record"
      onPointerMove={updateTilt}
      onPointerLeave={resetTilt}
    >
      <div className="operation-header">
        <div>
          <span>Verified causal trace</span>
          <strong>Autonomous operation</strong>
        </div>
        <span className="operation-id">01K47ABC9</span>
        <span className="live-state"><i /> verified</span>
      </div>

      <div className="operation-intent">
        <span className="operation-intent__icon"><Bot size={20} strokeWidth={1.6} /></span>
        <div>
          <small>Original intent</small>
          <strong>Acquire verified weather data under $0.01</strong>
        </div>
        <span>research-agent · Base</span>
      </div>

      <div className="operation-path" aria-label="Intent to verified outcome path">
        {stages.map(([label, Icon], index) => (
          <div className="operation-stage" key={label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <Icon size={18} strokeWidth={1.7} />
            <strong>{label}</strong>
            <small>{index === 2 ? "allowed" : index === stages.length - 1 ? "verified" : "correlated"}</small>
          </div>
        ))}
      </div>

      <div className="core-signals" aria-label="Trace Guard and Score evidence">
        <div className="core-signal core-signal--trace">
          <span><Activity size={16} /> Trace</span>
          <strong>13 spans</strong>
          <small>Intent to outcome · 2.81s</small>
        </div>
        <div className="core-signal core-signal--guard">
          <span><ShieldCheck size={16} /> Guard</span>
          <strong>Allowed</strong>
          <small>spend-limit-v4 · $0.0118</small>
        </div>
        <div className="core-signal core-signal--score">
          <span><Gauge size={16} /> Score</span>
          <strong>97.4</strong>
          <small>Outcome evidence verified</small>
        </div>
      </div>

      <div className="operation-readout">
        <span>tx 0xf93…82ac</span>
        <span>finality 2.81s</span>
        <span>outcome dataset_owned = true</span>
      </div>
    </div>
  );
}

function ContactForm() {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`ChainOps inquiry from ${String(data.get("name") || "visitor")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nProject: ${data.get("project")}\n\n${data.get("message")}`);
    window.location.href = `mailto:contact@chainops.live?subject=${subject}&body=${body}`;
  };
  return (
    <form className="contact-form" onSubmit={submit} action="mailto:contact@chainops.live" method="post" encType="text/plain">
      <label><span>Name</span><input name="name" autoComplete="name" required /></label>
      <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label className="contact-form__wide"><span>What does your agent execute?</span><input name="project" placeholder="Payments, settlement, treasury, data acquisition..." required /></label>
      <label className="contact-form__wide"><span>Message</span><textarea name="message" rows={5} required /></label>
      <button className="button button--primary" type="submit">Send inquiry <ArrowRight size={17} /></button>
    </form>
  );
}

function App() {
  useScrollReveals();

  return (
    <div className="site-shell" id="top">
      <TelemetryBackdrop />
      <Header />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Production reliability for onchain agents</p>
            <h1 id="hero-title">
              Know the intent. <span>Prove the outcome.</span>
            </h1>
            <p className="hero-lead">
              Trace AI intent, enforce transaction policy, and verify every onchain outcome from one causal record.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#platform">
                Explore ChainOps <ArrowRight size={17} />
              </a>
              <a className="button button--secondary" href="#architecture">
                View architecture
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <OperationSurface />
          </div>
        </section>

        <section className="boundary" id="why-chainops" aria-labelledby="boundary-title" data-reveal="left">
          <div className="section-index">The missing boundary</div>
          <div>
            <h2 id="boundary-title">AI observability stops before the transaction starts.</h2>
            <p>
              Agent traces explain a model decision. Blockchain tools explain a transaction. ChainOps connects both sides into one production truth.
            </p>
          </div>
          <div className="boundary-map" aria-label="Observability gap bridged by ChainOps">
            <span>AI intent</span>
            <i />
            <strong>ChainOps</strong>
            <i />
            <span>Onchain state</span>
          </div>
        </section>

        <section className="platform section" id="platform" aria-labelledby="platform-title">
          <div className="section-heading" data-reveal="zoom">
            <p className="eyebrow"><span /> One reliability control plane</p>
            <h2 id="platform-title">Trace. Guard. Score.</h2>
            <p>Three linked systems for every autonomous operation.</p>
          </div>
          <div className="product-grid" data-reveal="right">
            <article className="product-block product-block--trace">
              <div className="product-title">
                <Activity size={24} />
                <span>Trace</span>
              </div>
              <h3>Follow causality across every boundary.</h3>
              <p>Correlate prompts, tools, identity, payment, wallet, RPC, transaction, finality and business outcome.</p>
              <div className="mini-trace" aria-label="Causal trace boundaries">
                {traceBoundaries.map(([label, Icon]) => (
                  <span key={label}><Icon size={20} strokeWidth={1.7} aria-hidden="true" />{label}</span>
                ))}
              </div>
            </article>
            <article className="product-block product-block--guard">
              <div className="product-title"><ShieldCheck size={22} /><span>Guard</span></div>
              <h3>Stop unsafe execution before signing.</h3>
              <ul>
                <li><Check size={15} /> Spend and asset limits</li>
                <li><Check size={15} /> Contract allowlists</li>
                <li><Check size={15} /> Human approval routes</li>
              </ul>
            </article>
            <article className="product-block product-block--score">
              <div className="product-title"><Gauge size={22} /><span>Score</span></div>
              <h3>Turn evidence into operational trust.</h3>
              <div className="score-line"><span>Reliability evidence</span><strong>97.4</strong></div>
              <div className="score-meter"><i /></div>
              <small>Derived from verified behavior, not self-reported claims.</small>
            </article>
          </div>
        </section>

        <section className="console-evidence section" id="console" aria-labelledby="console-title">
          <div className="section-heading section-heading--console" data-reveal="left">
            <p className="eyebrow"><span /> The product, already observable</p>
            <h2 id="console-title">One control room for every autonomous operation.</h2>
            <p>Real console views built from deterministic, cross-linked operational evidence.</p>
          </div>
          <div data-reveal="zoom"><ConsoleGallery /></div>
        </section>

        <section className="architecture section" id="architecture" aria-labelledby="architecture-title">
          <div className="architecture-copy" data-reveal="left">
            <span className="section-index">Framework neutral by design</span>
            <h2 id="architecture-title">A control plane above the agent stack.</h2>
            <p>ChainOps connects external runtimes through an SDK and Runtime Adapter, then carries telemetry and control across Trace, Guard, Score and an optional Runtime. Identity, wallets, payment rails, RPC providers and EVM chains remain pluggable.</p>
            <a className="text-link" href="#workflow">See the operator workflow <ArrowRight size={16} /></a>
            <div className="architecture-principles">
              <span><ShieldCheck size={16} /> Non-custodial. Signing stays provider or customer controlled.</span>
              <span><Route size={16} /> Control Plane declares intent. Data Plane executes and reports evidence.</span>
              <span><Activity size={16} /> OpenTelemetry carries causal context across every boundary.</span>
            </div>
          </div>
          <div className="architecture-flow" data-reveal="right">
            {architectureSteps.map(([label, copy, Icon], index) => (
              <div className="flow-row" key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon size={20} />
                <div><strong>{label}</strong><small>{copy}</small></div>
              </div>
            ))}
          </div>
        </section>

        <section className="workflow section" id="workflow" aria-labelledby="workflow-title">
          <div className="workflow-head" data-reveal="zoom">
            <h2 id="workflow-title">Built for the incident, not the demo.</h2>
            <p>Operators get one answer path when an autonomous transaction fails, drifts or violates policy.</p>
          </div>
          <div className="workflow-console" data-reveal="up">
            <div className="console-bar"><span /><span /><span /><code>chainops / traces / 01K47ABC9</code></div>
            <div className="console-grid">
              <div className="console-event"><span>12:42:28.102</span><strong>intent.received</strong><small>Acquire verified weather data under $0.01</small></div>
              <div className="console-event"><span>12:42:28.406</span><strong>guard.allowed</strong><small>Policy spend-limit-v4 passed</small></div>
              <div className="console-event"><span>12:42:29.982</span><strong>transaction.finalized</strong><small>Base · 0xf93…82ac</small></div>
              <div className="console-event console-event--verified"><span>12:42:30.912</span><strong>outcome.verified</strong><small>Dataset ownership confirmed</small></div>
            </div>
          </div>
        </section>

        <section className="roadmap section" id="roadmap" aria-labelledby="roadmap-title">
          <div className="roadmap-heading" data-reveal="left">
            <span className="section-index">Evidence-gated delivery</span>
            <h2 id="roadmap-title">Earn the control plane, one proof at a time.</h2>
            <p>Each release begins only after the previous layer proves real developer value. Runtime and orchestration arrive after reliability evidence, not before it.</p>
          </div>
          <div className="roadmap-list" data-reveal="right">
            {roadmap.map(([phase, name, window, proof]) => (
              <article key={phase}>
                <span>{phase}</span>
                <div><strong>{name}</strong><small>{window}</small></div>
                <p>{proof}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="vision section" id="vision" aria-labelledby="vision-title">
          <div className="vision-mark" data-reveal="left"><Radar size={30} /><span>ChainOps / long view</span></div>
          <div data-reveal="zoom">
            <h2 id="vision-title">The operational trust layer for autonomous onchain systems.</h2>
            <p>When agents can pay, sign and mutate shared state, observability is only the beginning. ChainOps is building the neutral reliability layer that lets teams trace intent, govern execution, verify outcomes and recover safely without taking custody of keys or funds.</p>
          </div>
          <div className="vision-points" data-reveal="right">
            <span>Bring your own agent</span>
            <span>EVM first, provider neutral</span>
            <span>Evidence before automation</span>
            <span>Safe recovery, never blind replay</span>
          </div>
        </section>

        <section className="start" id="start" aria-labelledby="start-title" data-reveal="zoom">
          <div>
            <Zap size={28} />
            <h2 id="start-title">Make autonomous execution accountable.</h2>
          </div>
          <p>ChainOps is preparing its first operator cohort. Tell us what your agents execute onchain.</p>
          <a className="button button--primary" href="mailto:contact@chainops.live?subject=ChainOps%20early%20access">
            Request access <ArrowRight size={17} />
          </a>
        </section>

        <section className="contact section" id="contact" aria-labelledby="contact-title">
          <div className="contact-intro" data-reveal="left">
            <span className="section-index">Contact us</span>
            <h2 id="contact-title">Tell us what your agents put onchain.</h2>
            <p>Share the execution path, risk boundary or evidence gap you need ChainOps to solve.</p>
            <a href="mailto:contact@chainops.live">contact@chainops.live</a>
          </div>
          <div data-reveal="right"><ContactForm /></div>
        </section>
      </main>
      <footer>
        <a href="#top" aria-label="Back to top"><Brand /></a>
        <p>Production reliability for autonomous onchain systems.</p>
        <div className="footer-contact">
          <a href="mailto:contact@chainops.live">contact@chainops.live</a>
          <span>chainops.live</span>
          <span>© ChainOps 2026</span>
        </div>
      </footer>
      <CookieConsent />
      <ScrollToTop />
    </div>
  );
}

export default App;
