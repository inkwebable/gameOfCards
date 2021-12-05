const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');


module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  // devServer: {
  //   static: './dist',
  // },
  entry: {
    gameOfCards: './src/index.js',
    matchingCards: './examples/matching-cards/matchingCards.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    // publicPath: "dist/",
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      // inject: 'head'
    }),
  ],
  optimization: {
    moduleIds: 'deterministic', // keep vendor id (keep size the same)
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'all',
    //     },
    //   },
    // },
  },
});
