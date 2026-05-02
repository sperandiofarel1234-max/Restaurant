/**
 * App.js — Raiz do micro-pedido
 */
import React from "react";
import ListaPedido from "./components/ListaPedido";
import "./styles.css";

const App = () => {
  return (
    <div className="micro-pedido">
      <ListaPedido />
    </div>
  );
};

export default App;
