import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function useScrollReveals() {
  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    elements.forEach((element) => element.classList.add("reveal-pending"));

    const reveal = (element: HTMLElement) => {
      element.classList.add("reveal-visible");
      observer.unobserve(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      className={`scroll-to-top${visible ? " scroll-to-top--visible" : ""}`}
      type="button"
      aria-label="Scroll to top"
      title="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollToTop}
    >
      <ArrowUp size={18} strokeWidth={1.8} />
    </button>
  );
}
