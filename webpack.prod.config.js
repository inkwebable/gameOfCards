const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  entry: './src/index.js',
  // devtool: 'source-map',
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
        // options: {
          // publicPath: "/public/path/to/",
          // publicPath: path.resolve(__dirname, 'dist/styles/')
        // },
      },
    ]
  },
  // target: "node", // Node.js via require
  target: ["web", "es5"], // combining targets
  // stats: "verbose", // summarized information
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css'
      // linkType: "text/css",
      // publicPath: path.resolve(__dirname, 'dist/styles/')
    }),
    // new ForkTsCheckerWebpackPlugin(),
    // new CopyPlugin({
    //   patterns: [{ from: 'src/assets', to: 'assets' }]
    // })
  ],
});
