import 'babel-polyfill';
import path from 'path';
import {createReadStream, createWriteStream, readdir} from 'fs';

import exec from '../util/exec';
import read from '../util/read';
import transform from '../util/transform';
import write from '../util/write';

import initApp from './initApp';
import initDesktop from './initDesktop';
import initMobile from './initMobile';
import initWeb from './initWeb';
import run from './microRun';
import transformTemplate from './transformTemplate';

import pkg from '../../package.json';
import config from '../config';

export default function init(app: string, context: string): Promise<void> {
  const TEMPLATES = path.resolve(__dirname, '../../templates');
  const CONTAINER = context || process.cwd();
  const PROJECT = path.join(CONTAINER, app);
  const APP = path.join(PROJECT, 'app');
  const DESKTOP = path.join(PROJECT, 'desktop');

  return new Promise(async (resolve, reject) => {
    try {
      await initMobile({CONTAINER, PROJECT, TEMPLATES, app});

      await run(
        'Update gitignore',
        async () => {
          const gitignore = await read(path.join(PROJECT, '.gitignore'));
          await write(
            path.join(PROJECT, '.gitignore'),
            `${gitignore}

# Reactors
release/
desktop/
web/
`
          );
        },
      );

      await run(
        'Init yarn',
        async () => await exec('yarn init --yes', {cwd: PROJECT}),
      );

      await run(
        'Install app yarn',
        async () => await exec(
          `yarn add ${config.APP_DEPS.join(' ')}`,
          {cwd: PROJECT},
        ),
      );

      await run(
        'Create README',
        async () => await transform(
          path.join(TEMPLATES, 'README.md'),
          transformTemplate.bind({app}),
          path.join(PROJECT, 'README.md'),
        ),
      );

      await run(
        'Create reactors.json',
        async () => await write(
          path.join(PROJECT, 'reactors.json'),
          JSON.stringify({
            name: app,
            version: pkg.version,
            config,
          }, null, 2),
        ),
      );

      await run(
        'Copy assets',
        async () => await new Promise(async (resolveAssets, rejectAssets) => {
          try {
            await exec('mkdir assets', {cwd: PROJECT});
            readdir(path.resolve(TEMPLATES, 'assets'), async (error, files) => {
              if (error) {
                return rejectAssets(error);
              }
              await Promise.all(
                files
                  .filter((file) => /\.png$/.test(file))
                  // .map((file) => copy(
                  //   path.resolve(TEMPLATES, 'assets', file),
                  //   path.resolve(PROJECT, 'assets', file),
                  //   {defaultEncoding: 'binary'},
                  // ))
                  .map((file) => new Promise((resolveMapper) => {
                    const reader = createReadStream(
                      path.resolve(TEMPLATES, 'assets', file),
                    );
                    const writer = createWriteStream(
                      path.resolve(PROJECT, 'assets', file),
                    );
                    reader.pipe(writer);
                    reader.on('end', resolveMapper);
                  })),
              );
              resolveAssets();
            });
          } catch (error) {
            rejectAssets(error);
          }
        }),
      );

      await initApp({
        APP,
        PROJECT,
        TEMPLATES,
        app,
      });

      await initDesktop({
        DESKTOP,
        PROJECT,
        TEMPLATES,
        app,
      });

      await initWeb({
        APP,
        PROJECT,
        TEMPLATES,
        app,
      });

      resolve();
    } catch (error) {
      console.log(error.stack);
      reject(error);
    }
  });
}
