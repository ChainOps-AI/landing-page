import { useState } from "react";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "chainops-cookie-consent";

function readConsent() {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(
    () => readConsent() === null,
  );

  const choose = (choice: "accepted" | "declined") => {
    setVisible(false);
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Storage can be unavailable in hardened browsers; dismissal still works for this visit.
    }
  };

  if (!visible) return null;

  return (
    <aside className="cookie-consent" aria-labelledby="cookie-title">
      <div className="cookie-consent__icon" aria-hidden="true">
        <Cookie size={22} />
      </div>
      <div className="cookie-consent__copy">
        <strong id="cookie-title">We use cookies</strong>
        <p>We use cookies to ensure you get the best experience on our website.</p>
      </div>
      <div className="cookie-consent__actions">
        <button type="button" className="button button--primary" onClick={() => choose("accepted")}>Accept</button>
        <button type="button" className="button button--secondary" onClick={() => choose("declined")}>Decline</button>
      </div>
    </aside>
  );
}
