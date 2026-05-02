/**
 * ItemPedido.js — Linha de um item dentro do resumo do pedido
 *
 * Exibe nome, quantidade e subtotal.
 * Permite incrementar, decrementar e remover o item.
 *
 * @param {Object}   props.item     — { id, nome, preco, quantidade, emoji }
 * @param {Function} props.onAumentar  — callback para +1
 * @param {Function} props.onDiminuir  — callback para -1 (remove se qty = 1)
 */
import React from "react";

const ItemPedido = ({ item, onAumentar, onDiminuir }) => {
  const subtotal = (item.preco * item.quantidade).toFixed(2).replace(".", ",");

  return (
    <li className="item-pedido">
      <span className="item-pedido__emoji">{item.emoji}</span>

      <div className="item-pedido__info">
        <span className="item-pedido__nome">{item.nome}</span>
        <span className="item-pedido__subtotal">R$ {subtotal}</span>
      </div>

      <div className="item-pedido__controles">
        {/* Diminuir quantidade — remove se for 1 */}
        <button
          className="item-pedido__btn-ctrl"
          onClick={() => onDiminuir(item.id)}
          aria-label="Remover um"
        >
          −
        </button>

        <span className="item-pedido__quantidade">{item.quantidade}</span>

        {/* Aumentar quantidade */}
        <button
          className="item-pedido__btn-ctrl"
          onClick={() => onAumentar(item.id)}
          aria-label="Adicionar mais um"
        >
          +
        </button>
      </div>
    </li>
  );
};

export default ItemPedido;
