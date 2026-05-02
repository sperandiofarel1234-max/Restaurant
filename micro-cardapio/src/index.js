/**
 * index.js — Ponto de entrada do micro-cardapio
 *
 * Este arquivo existe apenas para criar uma FRONTEIRA ASSÍNCRONA.
 * O Module Federation exige que o código compartilhado (React, etc.)
 * seja carregado de forma assíncrona antes de qualquer import síncrono.
 * Por isso, o bootstrap real fica em bootstrap.js e é importado dinamicamente.
 */
import("./bootstrap");
