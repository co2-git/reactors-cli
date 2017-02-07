import React, {Component} from 'react';
import {
  Dimensions,
  Image,
  Link,
  ListView,
  StyleSheet,
  Text,
  View,
} from 'reactors';

export default class App extends Component {
  render() {
    const platforms = [
      {
        title: 'Web',
        link: 'https://www.w3.org/TR/html5/'
      },
      {
        title: 'iOS',
        link: 'http://www.apple.com/ios/'
      },
      {
        title: 'Android',
        link: 'https://www.android.com/'
      },
      {
        title: 'OSX',
        link: 'http://www.apple.com/osx/',
      },
      {
        title: 'Linux',
        link: 'http://www.ubuntu.com/'
      },
      {
        title: 'Windows',
        link: 'http://www.microsoft.com/en-us/windows'
      },
    ];

    return (
      <View style={styles.view}>
        <Text style={styles.h1}>{{{APP}}}</Text>
        <Text style={styles.text}>Welcome to your Reactors app</Text>
        <Text style={styles.text}>This app will work in:</Text>
        <ListView
          dataSource={platforms}
          renderRow={this._renderPlatform}
          />
        <Link href="https://github.com/co2-git/reactors">
          <Text style={[styles.text, styles.link]}>Reactors Doc</Text>
        </Link>
      </View>
    );
  }

  _renderPlatform = (platform) => {
    return (
      <View style={styles.platformRow}>
        <Image
          source={`../assets/${platform.image}.png`}
          style={styles.image}
          />
        <Link href={platform.link}>
          <Text style={styles.link}>{platform.title}</Text>
        </Link>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  link: {
    color: 'blue',
  },
  platformRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  text: {
    margin: 10,
  },
  view: {
    flex: 1,
    flexDirection: 'column',
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
