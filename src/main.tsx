import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/rethink-sans";
import "@fontsource/dm-mono/400.css";
import App from "./app";
import "./styles.css";

const root = document.getElementById("root")!;

const render = () => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

if (document.fonts?.load) {
  Promise.all([
    document.fonts.load("700 76px 'Rethink Sans Variable'"),
    document.fonts.load("400 12px 'DM Mono'"),
  ]).then(render, render);
} else {
  render();
}
