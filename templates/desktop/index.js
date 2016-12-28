/* globals document */
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./dist-desktop/app');
ReactDOM.render(
  React.createElement(App.default, {}),
  document.getElementById('reactors')
);
