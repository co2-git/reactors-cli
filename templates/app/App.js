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
import Web from '../assets/Web.png';
import iOS from '../assets/iOS.png';
import Android from '../assets/Android.png';
import OSX from '../assets/OSX.png';
import Linux from '../assets/Linux.png';
import Windows from '../assets/Windows.png';

export default class App extends Component {
  render() {
    const platforms = [
      {
        title: 'Web',
        link: 'https://www.w3.org/TR/html5/',
        image: Web,
      },
      {
        title: 'iOS',
        link: 'http://www.apple.com/ios/',
        image: iOS,
      },
      {
        title: 'Android',
        link: 'https://www.android.com/',
        image: Android,
      },
      {
        title: 'OSX',
        link: 'http://www.apple.com/osx/',
        image: OSX,
      },
      {
        title: 'Linux',
        link: 'http://www.ubuntu.com/',
        image: Linux,
      },
      {
        title: 'Windows',
        link: 'http://www.microsoft.com/en-us/windows',
        image: Windows,
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
          source={platform.image}
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
