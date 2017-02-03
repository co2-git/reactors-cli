const path = require('path');
const config = require('./reactors.json').config;

module.exports = {
  entry: {
    app: [`./${config.WEB_RENDER_FILE}`],
  },
  output: {
    path: path.resolve(__dirname, path.dirname(config.WEB_BUNDLE_FILE)),
    filename: path.basename(config.WEB_BUNDLE_FILE),
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
    ],
  },
};
