import path from 'path';
import colors from 'colors';

import init from './lib/init';
import run from './lib/run';
import upgrade from './lib/upgrade';

import exec from './util/exec';
import read from './util/read';
import signAndroid from './util/signAndroid';
import transform from './util/transform';

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

function getInfoFromPackage() {
  return new Promise(async (resolve, reject) => {
    try {
      const parsed = await read(path.join(process.cwd(), 'package.json'));
      const {name: appName, version: appVersion} = JSON.parse(parsed);
      resolve({appName, appVersion});
    } catch (error) {
      console.log(error.stack);
      reject(error);
    }
  });
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
        console.log('building for osx...');
        const {appName, appVersion} = await getInfoFromPackage();
        await exec('rm -rf desktop');
        await exec('yarn babelDesktop');
        await exec('webpack --config webpack-desktop.config.js');
        await exec('minify bundles/desktop.js');
        await transform(
          path.join(process.cwd(), config.DESKTOP_HTML_FILE),
          source => source
            .replace(
              /require\('\.\/render-desktop\.js'\);/,
              "require('./bundles/desktop.min.js');"
            )
        );
        const {dependencies} = JSON.parse(await read(
          path.join(process.cwd(), 'package.json')
        ));
        await transform(
          path.join(process.cwd(), 'package.json'),
          source => {
            const parsed = JSON.parse(source);
            parsed.dependencies = {};
            return JSON.stringify(parsed, null, 2);
          }
        );
        const revertChangedFiles = async () => {
          try {
            await transform(
              config.DESKTOP_HTML_FILE,
              source => source
                .replace(
                  /require\('\.\/bundles\/desktop\.min\.js'\);/,
                  "require('./render-desktop.js');"
                )
            );
            await transform(
              path.join(process.cwd(), 'package.json'),
              source => {
                const parsed = JSON.parse(source);
                parsed.dependencies = dependencies;
                return JSON.stringify(parsed, null, 2);
              }
            );
          } catch (error) {
            throw error;
          }
        };
        try {
          await exec([
            `electron-packager . ${appName}`,
            `--electron-version=${config.ELECTRON_VERSION}`,
            '--platform=darwin',
            `--version=${config.ELECTRON_VERSION}`,
            `--icon=${path.join(process.cwd(), 'assets/icons/icon')}`,
            `--out=${config.OSX_DIST.replace(/\{VERSION\}/g, appVersion)}`
          ].join(' '), {env: {...process.env, NODE_ENV: 'production'}});
        } catch (error) {
          await revertChangedFiles();
          throw error;
        }
        await revertChangedFiles();
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
