/* globals document */
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./dist/App');
ReactDOM.render(
  React.createElement(App.default, {}),
  document.getElementById('reactors')
);
