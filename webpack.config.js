var path = require("path");
var pkg = require("./package.json");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  target: "node",
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
    publicPath: "/dist"
    // libraryTarget: 'commonjs2',
    // library: pkg.name
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  externals: [
    {
      "react-native": "react-native"
      // react: "React",
      // "prop-types": "prop-types",
      // "react-dom": "ReactDOM"
    }
  ]
};
