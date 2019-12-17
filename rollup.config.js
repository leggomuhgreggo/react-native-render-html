import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";

import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
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
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              corejs: 3,
              modules: false,
              useBuiltIns: 'usage',
              targets: {
                ie: '11',
              },
            },
          ],
          "@babel/preset-react"
        ],
        "plugins": [
          "@babel/plugin-proposal-class-properties",
        ]
      }),
      resolve(),
      commonjs(),
    ],
  },
];


// export default {
//   input: "src/index.js",
//   output: [
//     {
//       file: pkg.main,
//       format: "cjs",
//       sourcemap: true,
//       globals: {
//         "@babel/runtime/regenerator": "regeneratorRuntime"
//       }
//     }
//   ],
//   plugins: [
//     peerDepsExternal(),
//     json(),
//     postcss({
//       modules: true
//     }),
//     url(),
//     svgr(),
//     babel({
//       "babelrc": false,
//       "runtimeHelpers": true,
//       "plugins": [
//         "@babel/plugin-proposal-class-properties",
//         "@babel/plugin-transform-async-to-generator",
//         "@babel/plugin-transform-regenerator",
//         ["@babel/plugin-transform-runtime", {
//             "helpers": true,
//             "regenerator": true
//         }]
//       ],
//       "presets": [
//           "@babel/preset-env",
//           "@babel/preset-react"
//       ],
//       "exclude": "node_modules/**"
//   }),
//     resolve(),
//     commonjs()
//   ]
// };