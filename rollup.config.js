import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";

import pkg from "./package.json";

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    json(),
    postcss({
      modules: true
    }),
    url(),
    svgr(),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-proposal-class-properties',
      ],
      presets: [
        ["@babel/env", {
          "modules": false,
        }],
        "@babel/preset-react"
      ],
    }),
    resolve(),
    commonjs()
  ]
};