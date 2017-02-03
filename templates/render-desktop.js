/* globals document */
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./{{{DESKTOP_APP_FILE}}}');
ReactDOM.render(
  React.createElement(App.default, {}),
  document.getElementById('reactors')
);
