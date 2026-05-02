/**
 * ListaCardapio.js — Lista completa de pratos disponíveis
 *
 * Renderiza todos os pratos do cardápio usando o componente ItemCardapio.
 * Os pratos são estáticos neste exemplo, mas poderiam vir de uma API.
 */
import React from "react";
import ItemCardapio from "./ItemCardapio";

// ── Dados estáticos do cardápio ───────────────────────────────────────────────
// Em produção, estes dados viriam de uma API (ex: fetch('/api/pratos'))
const PRATOS = [
  {
    id: 1,
    emoji: "🍕",
    nome: "Pizza Margherita",
    descricao: "Molho de tomate artesanal, mussarela de búfala e manjericão fresco",
    preco: 35.9,
    categoria: "Pizzas",
  },
  {
    id: 2,
    emoji: "🍔",
    nome: "Hambúrguer Artesanal",
    descricao: "Blend especial 180g, queijo cheddar, alface e tomate",
    preco: 28.9,
    categoria: "Lanches",
  },
  {
    id: 3,
    emoji: "🥗",
    nome: "Salada Caesar",
    descricao: "Alface romana, croutons crocantes e molho caesar clássico",
    preco: 22.5,
    categoria: "Saladas",
  },
  {
    id: 4,
    emoji: "🍝",
    nome: "Risoto de Funghi",
    descricao: "Arroz arbóreo cremoso com funghi secchi e parmesão aged",
    preco: 42.0,
    categoria: "Massas",
  },
  {
    id: 5,
    emoji: "🐟",
    nome: "Salmão Grelhado",
    descricao: "Filé de salmão norueguês com legumes salteados e limão siciliano",
    preco: 55.0,
    categoria: "Peixes",
  },
  {
    id: 6,
    emoji: "🍰",
    nome: "Tiramisù",
    descricao: "Sobremesa italiana com ladyfingers, café espresso e mascarpone",
    preco: 18.0,
    categoria: "Sobremesas",
  },
  {
    id: 7,
    emoji: "🍗",
    nome: "Frango à Parmegiana",
    descricao: "Filé empanado com molho de tomate e queijo gratinado",
    preco: 32.0,
    categoria: "Carnes",
  },
  {
    id: 8,
    emoji: "🥤",
    nome: "Limonada Suíça",
    descricao: "Limão, leite condensado e creme de leite batidos na hora",
    preco: 12.0,
    categoria: "Bebidas",
  },
];

const ListaCardapio = () => {
  // Agrupa os pratos por categoria para melhor organização visual
  const categorias = [...new Set(PRATOS.map((p) => p.categoria))];

  return (
    <section className="lista-cardapio">
      <header className="lista-cardapio__header">
        <h2 className="lista-cardapio__titulo">🍽️ Nosso Cardápio</h2>
        <p className="lista-cardapio__subtitulo">
          Escolha seus pratos favoritos e monte seu pedido
        </p>
      </header>

      {categorias.map((categoria) => (
        <div key={categoria} className="lista-cardapio__categoria">
          <h3 className="lista-cardapio__categoria-titulo">{categoria}</h3>
          <div className="lista-cardapio__grid">
            {PRATOS.filter((p) => p.categoria === categoria).map((prato) => (
              <ItemCardapio key={prato.id} prato={prato} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ListaCardapio;
