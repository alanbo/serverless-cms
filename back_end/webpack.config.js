const path = require('path');
// eslint-disable-next-line import/no-unresolved
const slsw = require('serverless-webpack');
// const nodeExternals = require('webpack-node-externals');

// console.log(node)
// externals: [nodeExternals({
//   whitelist: ['aws-appsync', 'ramda', 'graphql-tag']
// })],

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/,
        options: {
          presets: [
            // 'react',
            // 'stage-0',
            ['env', { targets: { node: '8.10' } }]
          ]
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: __dirname,
        exclude: /node_modules/
      }
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  externals: {
    pug: 'pug'
  },
};
