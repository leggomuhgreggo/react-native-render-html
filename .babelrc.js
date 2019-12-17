module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "false",
        useBuiltIns: "usage"
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    ["babel-plugin-transform-react-remove-prop-types", { mode: "wrap" }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-object-rest-spread", { useBuiltIns: true }],
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
};
