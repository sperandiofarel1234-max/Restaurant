const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    mode: argv.mode || "development",
    entry: "./src/index.js",

    output: {
      // publicPath 'auto' resolve URLs corretamente tanto local quanto no Vercel
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
      // Plugin principal do Micro Frontend
      new ModuleFederationPlugin({
        // Nome único deste micro — usado pelo container para importar
        name: "microCardapio",

        // Arquivo de entrada exposto remotamente
        filename: "remoteEntry.js",

        // O que este micro exporta para outros consumirem
        exposes: {
          "./CardapioApp": "./src/bootstrap",
        },

        // Dependências compartilhadas — React só carrega UMA vez entre todos os micros
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
        favicon: false,
      }),
    ],

    devServer: {
      port: 3001,
      hot: true,
      // Permite requisições do container (CORS)
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      historyApiFallback: true,
    },
  };
};
