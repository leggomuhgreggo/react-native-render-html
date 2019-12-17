

module.exports =  {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: 'current'
        },
        modules: 'cjs',
      }
    ],
    '@babel/preset-react',
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-transform-async-to-generator',
    ['babel-plugin-transform-react-remove-prop-types', { mode: 'wrap' }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'babel-plugin-add-module-exports'
  ]
};
