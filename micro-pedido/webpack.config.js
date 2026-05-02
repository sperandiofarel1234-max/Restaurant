const { ModuleFederationPlugin } = require("webpack").container;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => {
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
        // Nome único deste micro
        name: "microPedido",

        filename: "remoteEntry.js",

        // Exporta o componente de pedido para o container
        exposes: {
          "./PedidoApp": "./src/bootstrap",
        },

        // React compartilhado — garante que só uma instância rode
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
      port: 3002,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      historyApiFallback: true,
    },
  };
};
