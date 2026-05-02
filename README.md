# 🍽️ Restaurante MFE — Micro Frontends com Webpack Module Federation

Projeto prático de **Micro Frontends** usando **React** e **Webpack Module Federation**, dividido em três aplicações independentes:

| App | Porta local | Responsabilidade |
|-----|-------------|------------------|
| `container` | 3000 | Shell principal — importa e orquestra os micros |
| `micro-cardapio` | 3001 | Lista de pratos com botão "Adicionar ao pedido" |
| `micro-pedido` | 3002 | Resumo dos itens selecionados com total |

---

## 📁 Estrutura do Monorepo

```
micro-frontends-restaurante/
├── container/
│   ├── src/
│   │   ├── App.js          # Layout principal + importação dos micros
│   │   ├── bootstrap.js    # Ponto de entrada real (fronteira assíncrona)
│   │   └── index.js        # Carrega bootstrap de forma assíncrona
│   ├── public/index.html
│   ├── webpack.config.js   # Module Federation — consome os remotes
│   ├── vercel.json
│   └── package.json
│
├── micro-cardapio/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ListaCardapio.js  # Grid de pratos por categoria
│   │   │   └── ItemCardapio.js   # Card individual + disparo de evento
│   │   ├── App.js
│   │   ├── bootstrap.js          # mount/unmount para uso pelo container
│   │   ├── index.js
│   │   └── styles.css
│   ├── webpack.config.js   # Expõe CardapioApp via remoteEntry.js
│   ├── vercel.json
│   └── package.json
│
├── micro-pedido/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ListaPedido.js    # Escuta eventos + gerencia estado do pedido
│   │   │   └── ItemPedido.js     # Linha do pedido com controles de quantidade
│   │   ├── App.js
│   │   ├── bootstrap.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── webpack.config.js   # Expõe PedidoApp via remoteEntry.js
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- npm

### 1. Instalar dependências em cada app

```bash
cd micro-cardapio && npm install
cd ../micro-pedido  && npm install
cd ../container     && npm install
```

### 2. Iniciar os micros (em terminais separados)

```bash
# Terminal 1 — micro-cardapio na porta 3001
cd micro-cardapio
npm start

# Terminal 2 — micro-pedido na porta 3002
cd micro-pedido
npm start

# Terminal 3 — container na porta 3000
cd container
npm start
```

> ⚠️ Os micros **precisam estar rodando** antes de abrir o container,
> pois o container busca os `remoteEntry.js` deles ao carregar.

### 3. Acessar no navegador

- Container completo: http://localhost:3000
- Cardápio standalone: http://localhost:3001
- Pedido standalone:   http://localhost:3002

---

## 🌐 Deploy no Vercel

Cada app é um **projeto Vercel separado**. A ordem de deploy importa:
os micros precisam ser deployados antes do container para que você
tenha as URLs deles.

### Passo 1 — Deploy do micro-cardapio

1. No [Vercel Dashboard](https://vercel.com), clique em **Add New Project**
2. Importe seu repositório GitHub
3. Em **Root Directory**, selecione `micro-cardapio`
4. Clique em **Deploy**
5. Anote a URL gerada, ex: `https://micro-cardapio-xyz.vercel.app`

### Passo 2 — Deploy do micro-pedido

Repita o processo com `micro-pedido` como Root Directory.
Anote a URL, ex: `https://micro-pedido-xyz.vercel.app`

### Passo 3 — Deploy do container

1. Crie novo projeto com `container` como Root Directory
2. **Antes de fazer deploy**, vá em **Settings → Environment Variables** e adicione:

```
CARDAPIO_URL = https://micro-cardapio-xyz.vercel.app
PEDIDO_URL   = https://micro-pedido-xyz.vercel.app
```

3. Clique em **Deploy**

> 💡 O `vercel.json` de cada micro já configura o header
> `Access-Control-Allow-Origin: *` necessário para o container carregar
> os `remoteEntry.js` remotamente.

### Redeploy após mudanças

Se as URLs dos micros mudarem, atualize as env vars do container e
faça um novo deploy (Deployments → Redeploy).

---

## 🔄 Comunicação entre micros

Os dois micros são **completamente desacoplados** — nenhum importa código do outro.
A comunicação acontece via **Custom Events do browser**:

```
[micro-cardapio]                          [micro-pedido]
     │                                         │
     │  usuário clica "Adicionar"              │
     │                                         │
     ▼                                         │
window.dispatchEvent(                          │
  new CustomEvent('adicionar-item', {          │
    detail: { id, nome, preco, emoji },   ───► │ window.addEventListener(
    bubbles: true                              │   'adicionar-item', handler
  })                                           │ )
)                                              │
                                               ▼
                                        atualiza estado React
                                        → re-renderiza lista
```

### Por que Custom Events?

- **Desacoplamento total**: os micros não se conhecem
- **Zero dependências extras**: nativo do browser
- **Testável isoladamente**: cada micro pode simular eventos em testes

### Alternativas para projetos maiores

- `Redux` ou `Zustand` compartilhado no container
- `RxJS` com Subject/BehaviorSubject
- `Custom Event Bus` centralizado
- `Props` passadas pelo container via `mount(el, { onAdicionarItem })` 

---

## 🏗️ Como funciona o Module Federation

### O padrão `index.js → bootstrap.js`

```js
// index.js — só isso
import("./bootstrap"); // importação dinâmica = fronteira assíncrona
```

Isso é necessário porque o Module Federation precisa resolver as
**dependências compartilhadas** (React) antes de qualquer `import` síncrono.
Se você colocar código React direto no `index.js`, vai receber erros de
"cannot share singleton".

### Fluxo de carregamento no container

```
Container carrega index.html
  └─► bundle do container carregado
        └─► React.lazy(() => import("microCardapio/CardapioApp"))
              └─► browser busca remoteEntry.js do micro-cardapio
                    └─► React compartilhado resolvido (singleton)
                          └─► CardapioApp montado no DOM
```

### `shared: { react: { singleton: true } }`

Garante que apenas **uma instância do React** rode na página,
mesmo com múltiplos micros. Sem isso, cada micro carregaria sua
própria cópia do React, causando erros de hooks.

---

## 🛠️ Scripts disponíveis

Em cada pasta de app:

| Script | Descrição |
|--------|-----------|
| `npm start` | Inicia em modo desenvolvimento com HMR |
| `npm run build` | Build de produção (usado pelo Vercel) |
| `npm run build:dev` | Build de desenvolvimento (para debug) |

---

## 📚 Tecnologias

- **React 18** — UI dos três apps
- **Webpack 5** — bundling + Module Federation Plugin
- **Babel** — transpilação JSX/ES2022
- **Custom Events API** — comunicação entre micros
- **Vercel** — deploy e hosting

---

## 💡 Dicas de desenvolvimento

1. **Teste cada micro isoladamente** antes de integrá-los no container
2. **Inspecione o Network** no DevTools para ver os `remoteEntry.js` sendo carregados
3. **Console do container** mostra as URLs configuradas no início do webpack
4. Se um micro falhar no container, o `MicroErrorBoundary` exibe uma mensagem amigável sem quebrar os outros
5. O micro-pedido pode ser testado standalone disparando eventos manualmente no console:
   ```js
   window.dispatchEvent(new CustomEvent('adicionar-item', {
     detail: { id: 99, nome: 'Teste', preco: 10, emoji: '🍕' }
   }))
   ```
