const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    gameOfCards: './src/index.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/assets/images/game-of-cards/', to: path.resolve(__dirname, 'dist/images/game-of-cards/'), },
        // { from: 'other', to: 'public' },
      ]
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    // path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.scss$/, use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              fallback: require.resolve('url-loader'),
              outputPath: 'images/'
            },
          },
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ],
      }
    ]
  },
  // optimization: {
  //   moduleIds: 'hashed', // keep vendor id (keep size the same)
  //   runtimeChunk: "single",
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.css', '.scss']
  },
};
