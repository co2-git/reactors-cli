import path from 'path';
import init from './lib/init';
import exec from './util/exec';
import signAndroid from './lib/signAndroid';
import run from './lib/run';
import upgrade from './bin/upgrade';
import {name, version} from '../package.json';

const [, , cmd, app] = process.argv;

function cwd(...dirs) {
  return path.join(process.cwd(), ...dirs);
}

const PATH_TO_ANDROID = cwd('android');
const PATH_TO_APKS = path.join(PATH_TO_ANDROID, 'app/build/outputs/apks');

function quit(error) {
  console.log(error.stack);
  process.exit(8);
}

async function reactors() {
  switch (cmd) {
  case 'init': {
    try {
      console.log();
      console.log('Creating Reactors app', app);
      console.log();

      await init(app);
      console.log('Your app is ready to be awesome');
    } catch (error) {
      quit(error);
    }
  }
    break;

  case 'run': {
    run(app);
  }
    break;

  case 'upgrade': {
    try {
      await upgrade();
      console.log('Your app has been upgraded');
    } catch (error) {
      quit(error);
    }
  }
    break;

  case 'android': {
    switch (app) {
    case 'debug': {
      try {
        await exec('./gradlew clean assembleDebug', {cwd: PATH_TO_ANDROID});
        console.log(`Your APK is ready: ${PATH_TO_APKS}/apk-debug.apk`);
      } catch (error) {
        quit(error);
      }
    }
      break;

    case 'release': {
      try {
        await exec('./gradlew clean assembleRelease', {cwd: PATH_TO_ANDROID});
        console.log(`Your APK is ready: ${PATH_TO_APKS}/apk-release.apk`);
      } catch (error) {
        quit(error);
      }
    }
      break;

    case 'install': {
      try {
        await exec(`adb install ${PATH_TO_APKS}/apk-release.apk`);
      } catch (error) {
        quit(error);
      }
    }
      break;

    case 'sign': {
      try {
        await signAndroid();
      } catch (error) {
        quit(error);
      }
    }
      break;
    }
  }
    break;

  default: {
    try {
      console.log(name, version);
      console.log();
      await exec('cat ../README.md', {cwd: __dirname});
    } catch (error) {
      quit(error);
    }
  }
  }
}

reactors();
