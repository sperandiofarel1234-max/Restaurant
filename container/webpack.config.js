const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  /**
   * URLs dos micros remotos
   *
   * Desenvolvimento local: usa localhost com portas fixas
   * Produção (Vercel):     usa as variáveis de ambiente definidas no dashboard
   *
   * Como configurar no Vercel:
   *   CARDAPIO_URL=https://seu-micro-cardapio.vercel.app
   *   PEDIDO_URL=https://seu-micro-pedido.vercel.app
   */
  const CARDAPIO_URL =
    process.env.CARDAPIO_URL || "http://localhost:3001";
  const PEDIDO_URL =
    process.env.PEDIDO_URL || "http://localhost:3002";

  console.log(`\n🔗 Remotes configurados:`);
  console.log(`   micro-cardapio → ${CARDAPIO_URL}`);
  console.log(`   micro-pedido   → ${PEDIDO_URL}\n`);

  return {
    mode: argv.mode || "development",
    entry: "./src/index.js",

    output: {
      publicPath: "auto",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      clean: true,
    },

    resolve: {
      extensions: [".js", ".jsx"],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },

    plugins: [
      new ModuleFederationPlugin({
        name: "container",

        // O container só CONSOME micros, não expõe nada
        remotes: {
          /**
           * Sintaxe: "nome@URL/remoteEntry.js"
           * O nome antes do @ deve bater com o `name` no webpack do micro
           */
          microCardapio: `microCardapio@${CARDAPIO_URL}/remoteEntry.js`,
          microPedido: `microPedido@${PEDIDO_URL}/remoteEntry.js`,
        },

        shared: {
          react: {
            singleton: true,
            requiredVersion: "^18.2.0",
          },
          "react-dom": {
            singleton: true,
            requiredVersion: "^18.2.0",
          },
        },
      }),

      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
    ],

    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
  };
};
