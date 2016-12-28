/* global WebSocket */
import React, {Component} from 'react';
import {Text, View} from 'reactors';

export default class App extends Component {
  state = {
    message: 'loading',
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({message: 'connecting'}, () => {
        const ws = new WebSocket('ws://localhost:8008');
        ws.onerror = () => this.setState({message: 'error'});
        ws.onopen = () => this.setState({message: 'connected'});
      });
    }, 1000);
  }
  render() {
    return (
      <View>
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}
