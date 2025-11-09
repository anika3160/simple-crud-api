const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./src/main.ts",
  experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.mjs",
    module: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".mjs"],
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  devtool: false,
};
