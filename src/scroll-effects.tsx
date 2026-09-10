import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function useScrollReveals() {
  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    elements.forEach((element) => element.classList.add("reveal-pending"));

    const revealGroups = new Map<Element, HTMLElement[]>();
    elements.forEach((element) => {
      const section = element.closest("section");
      const trigger = section && section !== element ? section : element;
      const group = revealGroups.get(trigger) ?? [];
      group.push(element);
      revealGroups.set(trigger, group);
    });

    const reveal = (element: HTMLElement) => {
      element.classList.add("reveal-visible");
    };

    const revealGroup = (trigger: Element) => {
      revealGroups.get(trigger)?.forEach(reveal);
      observer.unobserve(trigger);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealGroup(entry.target);
        });
      },
      { rootMargin: "0px 55% -12% 55%", threshold: 0.01 },
    );

    revealGroups.forEach((_elements, trigger) => observer.observe(trigger));

    const revealPassedElements = () => {
      revealGroups.forEach((group, trigger) => {
        if (group.some((element) => !element.classList.contains("reveal-visible")) && trigger.getBoundingClientRect().top < window.innerHeight * 0.88) {
          revealGroup(trigger);
        }
      });
    };

    revealPassedElements();
    window.addEventListener("scroll", revealPassedElements, { passive: true });
    document.addEventListener("scroll", revealPassedElements, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", revealPassedElements);
      document.removeEventListener("scroll", revealPassedElements, { capture: true });
      observer.disconnect();
    };
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
