/**
 * index.js — Fronteira assíncrona do container
 * Mesma razão dos micros: garante que as dependências compartilhadas
 * (React) sejam resolvidas antes de qualquer import síncrono.
 */
import("./bootstrap");
