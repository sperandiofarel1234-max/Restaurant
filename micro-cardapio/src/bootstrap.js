/**
 * bootstrap.js — Núcleo do micro-cardapio
 *
 * Exporta funções mount/unmount para que o CONTAINER possa
 * montar este micro em qualquer elemento do DOM.
 *
 * Também monta standalone quando rodando de forma independente
 * (útil para desenvolvimento e testes isolados).
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Raiz React — reutilizada para evitar re-criações desnecessárias
let root = null;

/**
 * Monta o micro dentro do elemento informado.
 * Chamado pelo container via Module Federation.
 *
 * @param {HTMLElement} el — elemento onde o micro será renderizado
 */
export function mount(el) {
  root = createRoot(el);
  root.render(<App />);
}

/**
 * Desmonta o micro e libera recursos React.
 * Chamado pelo container ao desmontar o componente.
 */
export function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
}

// ── Modo standalone ──────────────────────────────────────────────────────────
// Quando este micro roda sozinho (npm start), monta no #root do seu próprio HTML
const standAloneRoot = document.getElementById("root");
if (standAloneRoot) {
  mount(standAloneRoot);
}
