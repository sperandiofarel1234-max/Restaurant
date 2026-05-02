/**
 * ListaPedido.js — Painel de resumo do pedido
 *
 * Comunicação entre micros:
 * ─────────────────────────────────────────────────────────────────────────────
 * Este componente ESCUTA o evento global 'adicionar-item' emitido pelo
 * micro-cardapio via window.dispatchEvent(new CustomEvent('adicionar-item')).
 *
 * Fluxo:
 *   [micro-cardapio] clica "Adicionar"
 *       → dispara window.dispatchEvent('adicionar-item', { detail: prato })
 *           → [micro-pedido] recebe o evento
 *               → atualiza estado local (useState)
 *                   → re-renderiza a lista
 *
 * Vantagem: os dois micros são completamente independentes.
 * Nenhum conhece a implementação do outro — apenas o contrato do evento.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useState, useEffect, useCallback } from "react";
import ItemPedido from "./ItemPedido";

const ListaPedido = () => {
  // Estado: array de itens com { id, nome, preco, emoji, quantidade }
  const [itens, setItens] = useState([]);

  /**
   * Handler do evento global 'adicionar-item'
   * Usa useCallback para evitar re-registro desnecessário no addEventListener
   */
  const handleAdicionarItem = useCallback((event) => {
    const prato = event.detail;

    setItens((prev) => {
      // Verifica se o prato já está no pedido
      const existente = prev.find((item) => item.id === prato.id);

      if (existente) {
        // Incrementa a quantidade
        return prev.map((item) =>
          item.id === prato.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      // Novo item no pedido
      return [...prev, { ...prato, quantidade: 1 }];
    });
  }, []);

  // Registra e limpa o listener do evento global
  useEffect(() => {
    window.addEventListener("adicionar-item", handleAdicionarItem);
    return () => {
      window.removeEventListener("adicionar-item", handleAdicionarItem);
    };
  }, [handleAdicionarItem]);

  /**
   * Aumenta a quantidade de um item pelo id
   */
  const handleAumentar = (id) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  /**
   * Diminui a quantidade; remove o item se quantidade chegar a 0
   */
  const handleDiminuir = (id) => {
    setItens((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  /**
   * Limpa todo o pedido
   */
  const handleLimpar = () => setItens([]);

  // Cálculo do total
  const total = itens
    .reduce((acc, item) => acc + item.preco * item.quantidade, 0)
    .toFixed(2)
    .replace(".", ",");

  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <section className="lista-pedido">
      <header className="lista-pedido__header">
        <h2 className="lista-pedido__titulo">
          🧾 Meu Pedido
          {totalItens > 0 && (
            <span className="lista-pedido__badge">{totalItens}</span>
          )}
        </h2>
      </header>

      {itens.length === 0 ? (
        // Estado vazio
        <div className="lista-pedido__vazio">
          <span className="lista-pedido__vazio-icon">🛒</span>
          <p>Seu pedido está vazio.</p>
          <p className="lista-pedido__vazio-dica">
            Adicione itens do cardápio ao lado!
          </p>
        </div>
      ) : (
        <>
          <ul className="lista-pedido__lista">
            {itens.map((item) => (
              <ItemPedido
                key={item.id}
                item={item}
                onAumentar={handleAumentar}
                onDiminuir={handleDiminuir}
              />
            ))}
          </ul>

          <footer className="lista-pedido__footer">
            <div className="lista-pedido__total">
              <span>Total</span>
              <strong>R$ {total}</strong>
            </div>

            <button className="lista-pedido__btn-confirmar">
              ✅ Confirmar Pedido
            </button>

            <button
              className="lista-pedido__btn-limpar"
              onClick={handleLimpar}
            >
              🗑️ Limpar pedido
            </button>
          </footer>
        </>
      )}
    </section>
  );
};

export default ListaPedido;
