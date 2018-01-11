module.exports = {
  entry: './render-desktop.js',
  output: {
    filename: 'bundles/desktop.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // query: {
        //   ast: false,
        //   babelrc: false,
        //   comments: false,
        //   minified: true,
        //   presets: config.WEB_BABEL_PRESETS,
        //   plugins: config.WEB_BABEL_PLUGINS,
        // }
      },
      {
        test: /node_modules\/react-native/,
        loader: 'ignore-loader',
      },
    ],
  },
};
