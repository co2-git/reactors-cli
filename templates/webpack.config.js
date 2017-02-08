const path = require('path');
const webpack = require('webpack');
const config = require('./reactors.json').config;

module.exports = {
  devtool: 'eval',

  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?' +
      `https://localhost:${config.WEB_WEBPACK_DEV_SERVER_PORT}`,
    'webpack/hot/only-dev-server',
    `./${config.WEB_RENDER_FILE}`
  ],

  output: {
    path: path.join(__dirname, 'web'),
    filename: 'bundle.js',
    publicPath: '/web/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    compress: true,
    https: true,
    historyApiFallback: true,
    inline: false,
    port: config.WEB_WEBPACK_DEV_SERVER_PORT,
    hot: true
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          ast: false,
          babelrc: false,
          comments: false,
          minified: true,
          presets: config.WEB_BABEL_PRESETS,
          plugins: config.WEB_BABEL_PLUGINS,
        }
      },
      {
        test: /node_modules\/react-native/,
        loader: 'ignore-loader',
      },
      {
        test: /\.(png|jpe?g)?/,
        loader: 'url-loader?limit=99999',
      },
    ],
  },
};
