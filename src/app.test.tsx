import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./app";

describe("ChainOps landing page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("chainops-cookie-consent");
  });

  it("presents the complete product narrative", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Know the intent. Prove the outcome.",
    );
    expect(screen.getByRole("heading", { name: "Trace. Guard. Score." })).toBeInTheDocument();
    expect(screen.getByText("Verified causal trace")).toBeInTheDocument();
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
});
