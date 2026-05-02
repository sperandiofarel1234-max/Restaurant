/**
 * bootstrap.js — Ponto de entrada real do container
 * Monta a aplicação React principal no elemento #root.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
