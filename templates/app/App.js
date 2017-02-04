import React, {Component} from 'react';
import {
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
        image: '../assets/HTML.png',
        link: 'https://www.w3.org/TR/html5/'
      },
      {
        title: 'iOS',
        image: '../assets/Apple.png',
        link: 'http://www.apple.com/ios/'
      },
      {
        title: 'Android',
        image: '../assets/Android.png',
        link: 'https://www.android.com/'
      },
      {
        title: 'Mac OSX',
        image: '../assets/OSX.png',
        link: 'http://www.apple.com/osx/',
      },
      {
        title: 'Linux',
        image: '../assets/Linux.png',
        link: 'http://www.ubuntu.com/'
      },
      {
        title: 'Windows',
        image: '../assets/Windows.png',
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
        <Image source={platform.image} style={styles.image} />
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
