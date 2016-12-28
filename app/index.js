import path from 'path';
import colors from 'colors';

import exec from './util/exec';
import init from './lib/init';
import run from './lib/run';
import upgrade from './lib/upgrade';

import read from './util/read';
import signAndroid from './util/signAndroid';

import config from './config';
import {name, version} from '../package.json';

const [, , cmd, arg1] = process.argv;

function cwd(...dirs) {
  return path.join(process.cwd(), ...dirs);
}

const PATH_TO_ANDROID = cwd('android');
const PATH_TO_APKS = path.join(PATH_TO_ANDROID, 'app/build/outputs/apks');

function quit(error) {
  console.log(colors.red.bold('Error'));
  console.log(colors.yellow(error.stack));
  process.exit(8);
}

async function reactors() {
  switch (cmd) {

  case 'build': {
    switch (arg1) {

    case 'android': {
      try {
        await exec('./gradlew clean assembleRelease', {cwd: PATH_TO_ANDROID});
        console.log(`Your APK is ready: ${PATH_TO_APKS}/apk-release.apk`);
      } catch (error) {
        quit(error);
      }
    } break;

    case 'osx': {
      try {
        const cmds = [
          'npm run babelDesktop',
          'cp -r node_modules/ desktop/node_modules/',
          `electron-packager desktop lexouxou \
            --platform=darwin \
            --version=${config.ELECTRON_VERSION}`,
          'rm -rf desktop/node_modules',
        ];
        for (const cmd of cmds) {
          await exec(cmd);
        }
        // const options = {
        //   dir: path.join(process.cwd(), 'desktop'),
        //   arch: 'all',
        //   version: '1.4.12',
        //   name: 'mongodaemon',
        //   out: path.join(process.cwd(), 'dist/osx'),
        //   platform: 'darwin',
        //   prune: false,
        //   overwrite: true,
        // };
        // packager(options, async (err, appPaths) => {
        //   if (err) {
        //     return quit(err);
        //   }
        //   console.log(appPaths);
        //   await exec('rm -rf desktop/node_modules');
        //   exec(`open ${appPaths[0]}/mongodaemon.app`);
        // });
      } catch (error) {
        quit(error);
      }
    } break;

    }
  } break;

  case 'init': {
    try {
      const app = arg1;

      console.log();
      console.log('Creating Reactors app', app);
      console.log();

      await init(app);
      console.log(config.INIT_OK_MSG);
    } catch (error) {
      quit(error);
    }
  } break;

  case 'install': {
    switch (arg1) {

    case 'android': {
      try {
        await exec(`adb install ${PATH_TO_APKS}/apk-release.apk`);
      } catch (error) {
        quit(error);
      }
    } break;

    }
  } break;

  case 'run': {
    const platform = arg1;
    run(platform);
  } break;

  case 'sign': {
    switch (arg1) {

    case 'android': {
      try {
        await signAndroid();
      } catch (error) {
        quit(error);
      }
    } break;

    }
  } break;

  case 'upgrade': {
    try {
      await upgrade();
      console.log('Your app has been upgraded');
    } catch (error) {
      quit(error);
    }
  } break;

  default: {
    try {
      console.log(name, version);
      console.log();
      console.log(await read(path.resolve(__dirname, '../README.md')));
    } catch (error) {
      quit(error);
    }
  }
  }
}

reactors();
