const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'gameOfCards.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: "umd",
      name: 'GameOfCards'
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.scss$/, use: [
          // { loader: 'style-loader' },
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ]
      },
    ]
  },
  // target: "node", // Node.js via require
  target: ["web", "es5"], // combining targets
  stats: "verbose", // summarized information
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      // publicPath: path.resolve(__dirname, 'dist/styles/')
    })
  ],
});
