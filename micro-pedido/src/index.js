/**
 * index.js — Fronteira assíncrona do micro-pedido
 * Necessário para que o Module Federation carregue as dependências
 * compartilhadas (React) antes de qualquer import síncrono.
 */
import("./bootstrap");
