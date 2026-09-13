import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./app";

describe("ChainOps landing page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("chainops-cookie-consent");
    window.localStorage.removeItem("chainops-landing-theme");
    document.documentElement.dataset.theme = "dark";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("presents the complete product narrative", () => {
    render(<App />);
    expect(document.querySelector(".brand-mark")).toHaveAttribute("src", "/favicon.svg");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Know the intent. Prove the outcome.",
    );
    expect(screen.getByRole("heading", { name: "Trace. Guard. Score." })).toBeInTheDocument();
    expect(screen.getByText("Verified causal trace")).toBeInTheDocument();
    expect(screen.getByLabelText("ChainOps autonomous operation record")).toBeInTheDocument();
    expect(screen.getByLabelText("Trace Guard and Score evidence")).toBeInTheDocument();
    expect(document.querySelectorAll(".ambient-node")).toHaveLength(9);
    expect(screen.getByRole("heading", { name: /One control room/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Earn the control plane/ })).toBeInTheDocument();
    expect(screen.getByAltText(/ChainOps Overview console/i)).toHaveAttribute("src", "/images/console-overview.png");
    expect(document.querySelectorAll(".capture-open")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Open 20 more Console screenshots" })).toBeInTheDocument();
    expect(document.querySelectorAll(".mini-trace svg")).toHaveLength(5);
    expect(document.querySelector(".telemetry-backdrop")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Tell us what your agents put onchain/i })).toBeInTheDocument();
    expect(screen.getByText("© ChainOps 2026")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Request access/ })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:contact@chainops.live"),
    );
    expect(screen.getByRole("link", { name: "ChainOps on X" })).toHaveAttribute("href", "https://x.com/ChainOps-AI");
    expect(screen.getByRole("link", { name: "ChainOps on GitHub" })).toHaveAttribute("href", "https://github.com/ChainOps-AI");
    expect(screen.getByRole("link", { name: "ChainOps on X" }).querySelector("svg")).toBeInTheDocument();
  });

  it("tilts the operation surface toward the pointer and resets on leave", () => {
    render(<App />);
    const surface = screen.getByLabelText("ChainOps autonomous operation record");
    vi.spyOn(surface, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(surface, { clientX: 150, clientY: 25, pointerType: "mouse" });
    expect(surface.style.getPropertyValue("--tilt-x")).toBe("1.50deg");
    expect(surface.style.getPropertyValue("--tilt-y")).toBe("1.75deg");
    expect(surface.style.getPropertyValue("--surface-x")).toBe("75.0%");

    fireEvent.pointerLeave(surface, { pointerType: "mouse" });
    expect(surface.style.getPropertyValue("--tilt-x")).toBe("0deg");
    expect(surface.style.getPropertyValue("--tilt-y")).toBe("0deg");
  });

  it("opens, advances and dismisses the Console slideshow", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Open Overview screenshot" }));
    const overviewDialog = screen.getByRole("dialog", { name: "Overview screenshot" });
    expect(overviewDialog).toBeInTheDocument();
    expect(overviewDialog).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Next screenshot" }));
    expect(screen.getByRole("dialog", { name: "Traces screenshot" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open 20 more Console screenshots" }));
    expect(screen.getByRole("dialog", { name: "Agents screenshot" })).toBeInTheDocument();
    fireEvent.mouseDown(document.querySelector(".gallery-backdrop")!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("remembers cookie consent choices", () => {
    const { unmount } = render(<App />);
    expect(screen.getByRole("complementary", { name: "We use cookies" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(screen.queryByRole("complementary", { name: "We use cookies" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("chainops-cookie-consent")).toBe("accepted");
    unmount();
    render(<App />);
    expect(screen.queryByRole("complementary", { name: "We use cookies" })).not.toBeInTheDocument();
  });

  it("keeps consent usable when browser storage is unavailable", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    render(<App />);
    expect(screen.getByRole("complementary", { name: "We use cookies" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Decline" }));
    expect(screen.queryByRole("complementary", { name: "We use cookies" })).not.toBeInTheDocument();
    getItem.mockRestore();
    setItem.mockRestore();
  });

  it("opens and closes the mobile navigation", () => {
    render(<App />);
    const menu = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menu);
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("switches and remembers the landing color mode", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Switch to light mode" });
    fireEvent.click(toggle);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("chainops-landing-theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
  });

  it("reveals the scroll-to-top control after the hero leaves view", () => {
    const observers: Array<{ callback: IntersectionObserverCallback; elements: Element[] }> = [];
    class MockIntersectionObserver {
      callback: IntersectionObserverCallback;
      elements: Element[] = [];
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(element: Element) { this.elements.push(element); }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const { container } = render(<App />);
    const button = container.querySelector<HTMLButtonElement>(".scroll-to-top")!;
    const hero = container.querySelector(".hero")!;
    const topObserver = observers.find((observer) => observer.elements.includes(hero))!;

    expect(button).toHaveAttribute("aria-hidden", "true");
    act(() => topObserver.callback([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
    expect(button).toHaveAttribute("aria-hidden", "false");
    fireEvent.click(button);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("reveals sections already passed when entering through a deep link", () => {
    const observerOptions: IntersectionObserverInit[] = [];
    class MockIntersectionObserver {
      constructor(_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        observerOptions.push(options ?? {});
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: -240,
      bottom: -120,
      left: 0,
      right: 600,
      width: 600,
      height: 120,
      x: 0,
      y: -240,
      toJSON: () => ({}),
    });

    const { container } = render(<App />);
    const architectureCopy = container.querySelector("#architecture [data-reveal]");
    const roadmapHeading = container.querySelector("#roadmap [data-reveal]");
    const visionMark = container.querySelector("#vision [data-reveal]");

    expect(architectureCopy).toHaveClass("reveal-visible");
    expect(roadmapHeading).toHaveClass("reveal-visible");
    expect(visionMark).toHaveClass("reveal-visible");
    expect(observerOptions).toContainEqual(expect.objectContaining({ rootMargin: "0px 55% -12% 55%" }));
  });

  it("reveals sections skipped by a fast scroll", () => {
    class MockIntersectionObserver {
      constructor(_callback: IntersectionObserverCallback) {}
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const bounds = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      top: 1800,
      bottom: 1920,
      left: 0,
      right: 600,
      width: 600,
      height: 120,
      x: 0,
      y: 1800,
      toJSON: () => ({}),
    });

    const { container } = render(<App />);
    const architectureCopy = container.querySelector("#architecture [data-reveal]");
    expect(architectureCopy).not.toHaveClass("reveal-visible");

    bounds.mockReturnValue({
      top: -400,
      bottom: -280,
      left: 0,
      right: 600,
      width: 600,
      height: 120,
      x: 0,
      y: -400,
      toJSON: () => ({}),
    });
    fireEvent.scroll(window);

    expect(architectureCopy).toHaveClass("reveal-visible");
  });
});
