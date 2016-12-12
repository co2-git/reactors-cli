import 'babel-polyfill';
import path from 'path';

import copy from '../util/copy';
import changeJSON from '../util/changeJSON';
import exec from '../util/exec';
import read from '../util/read';
import transform from '../util/transform';
import write from '../util/write';
import yarnInstall from '../util/yarnInstall';

import logger from './logger';

import pkg from '../../package.json';

export default function init(app: string, context: string): Promise<void> {
  const TEMPLATES = path.resolve(__dirname, '../../templates');
  const CONTAINER = context || process.cwd();
  const APP = path.join(CONTAINER, app);

  function transformer(source: string): string {
    return source.replace(/\{app\}/g, app);
  }

  return new Promise(async (resolve, reject) => {
    try {
      const templatesToTransform = [
        {'index.mobile.js': 'index.ios.js'},
        {'index.mobile.js': 'index.android.js'},
        'index.html',
        'index.web.js',
        'index.dom.js',
        'index.desktop.js',
        'app/App.js',
        'webpack.config.js',
        {['index.desktop.html']: 'desktop/index.html'},
        'README.md',
      ];

      const templatesToCopy = [
        'index.electron.js',
      ];

      await logger('Installing React Native');
      await exec(`react-native init ${app}`, {cwd: CONTAINER});
      await logger.ok('React Native installed');

      await logger('Create app directories');
      await exec('mkdir app', {cwd: APP});
      await exec('mkdir desktop', {cwd: APP});

      await logger('Install templates');
      for (const template of templatesToTransform) {
        if (typeof template === 'string') {
          await transform(
            path.join(TEMPLATES, template),
            transformer,
            path.join(APP, template),
          );
        } else if (typeof template === 'object') {
          for (const local in template) {
            if (template[local]) {
              await transform(
                path.join(TEMPLATES, local),
                transformer,
                path.join(APP, template[local]),
              );
            }
          }
        }
      }

      for (const template of templatesToCopy) {
        if (typeof template === 'string') {
          await copy(
            path.join(TEMPLATES, template),
            path.join(APP, template),
          );
        } else if (typeof template === 'object') {
          for (const local in template) {
            if (template[local]) {
              await copy(
                path.join(TEMPLATES, local),
                path.join(APP, template[local]),
              );
            }
          }
        }
      }

      await logger('Installing npm dependencies');
      await yarnInstall(APP,
        'reactors',
        'react-dom',
        'babel-loader',
        'webpack',
        'babel-preset-react',
        'babel-preset-es2015',
        'babel-preset-stage-0',
        'ignore-loader',
      );

      await logger('Updating package.json');
      await changeJSON(
        path.join(APP, 'package.json'),
        (json) => {
          json.main = 'index.desktop.js';
        },
      );

      await logger('create reactors.json');
      await write(
        path.join(APP, 'reactors.json'),
        JSON.stringify({version: pkg.version}),
      );

      await logger('Add bundles to gitignore');
      const gitignore = await read(path.join(APP, '.gitignore'));
      await write(
        path.join(APP, '.gitignore'),
        `${gitignore}

# Reactors

/desktop/bundle.js
/web/bundle.js
`,
      );

      await logger.ok(`Reactors app ${app} successfully created`);

      resolve();
    } catch (error) {
      console.log(error.stack);
      reject(error);
    }
  });
}
