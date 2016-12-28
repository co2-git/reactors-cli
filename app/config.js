export default {
  ELECTRON_VERSION: '1.4.13',
  INIT_OK_MSG: 'Your app is ready to be awesome',
  APP_DEV_DEPS: [
  ],
  APP_DEPS: [
    'babel-cli',
    'babel-preset-electron',
    'babel-preset-react',
    'flow-bin',
    'react',
    'reactors',
    'react-dom',
  ],
  DESKTOP_BABEL_PRESETS: [
    'react',
    'electron',
  ],
  DESKTOP_BABEL_OUT_DIR: 'dist/desktop',
  DESKTOP_MAIN_PROCESS_FILE: 'main.js',
  DESKTOP_HTML_FILE: 'index.desktop.html',
  DESKTOP_RENDERER_FILE: 'render.js',
  REACT_APP_FILE: 'dist/desktop/App.js',
  OSX_DIST: 'release/{VERSION}/osx',
};
