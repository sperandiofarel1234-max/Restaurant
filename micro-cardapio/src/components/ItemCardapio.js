/**
 * ItemCardapio.js — Componente de item individual do cardápio
 *
 * Responsabilidades:
 * - Exibir nome, descrição e preço de um prato
 * - Disparar evento global ao clicar em "Adicionar ao pedido"
 *
 * Comunicação entre micros:
 * Usamos window.dispatchEvent com CustomEvent para comunicação desacoplada.
 * O micro-pedido escuta o evento 'adicionar-item' e atualiza seu estado.
 * Isso evita dependência direta entre os dois micros.
 *
 * @param {Object} props.prato — { id, nome, descricao, preco, emoji }
 */
import React, { useState } from "react";

const ItemCardapio = ({ prato }) => {
  // Feedback visual temporário ao adicionar item
  const [adicionado, setAdicionado] = useState(false);

  const handleAdicionar = () => {
    // Dispara o evento global que o micro-pedido está escutando
    window.dispatchEvent(
      new CustomEvent("adicionar-item", {
        detail: { ...prato },
        bubbles: true,
      })
    );

    // Exibe feedback visual por 1 segundo
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1000);
  };

  return (
    <article className="item-cardapio">
      <div className="item-cardapio__emoji">{prato.emoji}</div>

      <div className="item-cardapio__info">
        <h3 className="item-cardapio__nome">{prato.nome}</h3>
        <p className="item-cardapio__descricao">{prato.descricao}</p>
        <span className="item-cardapio__preco">
          R$ {prato.preco.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <button
        className={`item-cardapio__btn ${adicionado ? "item-cardapio__btn--adicionado" : ""}`}
        onClick={handleAdicionar}
        aria-label={`Adicionar ${prato.nome} ao pedido`}
      >
        {adicionado ? "✓ Adicionado!" : "+ Adicionar"}
      </button>
    </article>
  );
};

export default ItemCardapio;
