/**
 * bootstrap.js — Núcleo do micro-pedido
 *
 * Exporta mount/unmount para uso pelo container.
 * Quando rodando standalone, monta no #root do próprio HTML.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

let root = null;

/**
 * Monta o micro no elemento informado pelo container.
 * @param {HTMLElement} el
 */
export function mount(el) {
  root = createRoot(el);
  root.render(<App />);
}

/**
 * Desmonta o micro e limpa recursos.
 */
export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

// Modo standalone — para rodar e testar isoladamente
const standAloneRoot = document.getElementById("root");
if (standAloneRoot) {
  mount(standAloneRoot);
}
