import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/archivo";
import "@fontsource-variable/ibm-plex-sans";
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
    document.fonts.load("660 76px 'Archivo Variable'"),
    document.fonts.load("400 18px 'IBM Plex Sans Variable'"),
  ]).then(render, render);
} else {
  render();
}
