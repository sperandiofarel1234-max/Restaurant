/**
 * App.js — Layout principal do container
 *
 * Importa os dois micros via React.lazy + Suspense (Module Federation).
 * Cada micro é carregado de forma independente e assíncrona.
 *
 * React.lazy funciona aqui porque o Module Federation transforma
 * a importação dinâmica em uma chamada remota ao remoteEntry.js do micro.
 */
import React, { Suspense } from "react";
import "./styles.css";

// ── Importação dos micros via Module Federation ───────────────────────────────
// "microCardapio/CardapioApp" → nome configurado no webpack do micro-cardapio
// O alias antes da barra bate com a chave em `remotes` do container webpack
const CardapioApp = React.lazy(() => import("microCardapio/CardapioApp"));
const PedidoApp = React.lazy(() => import("microPedido/PedidoApp"));

// ── Componente de fallback enquanto o micro carrega ───────────────────────────
const Loading = ({ nome }) => (
  <div className="loading-micro">
    <div className="loading-micro__spinner" />
    <p>Carregando {nome}...</p>
  </div>
);

// ── Boundary de erro para quando um micro falha ao carregar ───────────────────
class MicroErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(`[Container] Erro ao carregar micro "${this.props.nome}":`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="micro-error">
          <p>⚠️ Falha ao carregar o micro <strong>{this.props.nome}</strong>.</p>
          <p className="micro-error__dica">
            Verifique se ele está rodando e se as URLs estão corretas.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Wrapper que combina ErrorBoundary + Suspense ───────────────────────────────
const MicroWrapper = ({ nome, children }) => (
  <MicroErrorBoundary nome={nome}>
    <Suspense fallback={<Loading nome={nome} />}>
      {children}
    </Suspense>
  </MicroErrorBoundary>
);

// ── App principal ─────────────────────────────────────────────────────────────
const App = () => {
  return (
    <div className="container-app">
      {/* Cabeçalho da aplicação */}
      <header className="container-header">
        <h1 className="container-header__titulo">🍽️ Restaurante MFE</h1>
        <p className="container-header__subtitulo">
          Micro Frontends com Webpack Module Federation
        </p>
      </header>

      {/* Layout de duas colunas: cardápio | pedido */}
      <main className="container-layout">
        {/* Coluna esquerda — micro-cardapio */}
        <section className="container-layout__cardapio">
          <MicroWrapper nome="Cardápio">
            <CardapioApp />
          </MicroWrapper>
        </section>

        {/* Divisor visual */}
        <div className="container-layout__divider" />

        {/* Coluna direita — micro-pedido */}
        <aside className="container-layout__pedido">
          <MicroWrapper nome="Pedido">
            <PedidoApp />
          </MicroWrapper>
        </aside>
      </main>

      <footer className="container-footer">
        <p>
          Container App · micro-cardapio · micro-pedido · Module Federation
        </p>
      </footer>
    </div>
  );
};

export default App;
