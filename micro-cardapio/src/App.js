/**
 * App.js — Raiz do micro-cardapio
 *
 * Componente raiz simples que renderiza a lista do cardápio.
 * Pode ser expandido para incluir rotas internas se necessário.
 */
import React from "react";
import ListaCardapio from "./components/ListaCardapio";
import "./styles.css";

const App = () => {
  return (
    <div className="micro-cardapio">
      <ListaCardapio />
    </div>
  );
};

export default App;
