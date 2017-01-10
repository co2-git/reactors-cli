import 'babel-polyfill';
import path from 'path';

import exec from '../util/exec';
import read from '../util/read';
import transform from '../util/transform';
import write from '../util/write';

import initApp from './initApp';
import initDesktop from './initDesktop';
import initMobile from './initMobile';
// import initWeb from './initWeb';
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
`
          );
        },
      );

      await run(
        'Init yarn',
        async () => await exec('yarn init --yes', {cwd: PROJECT}),
      );

      // await run(
      //   'Install app yarn dev',
      //   async () => await exec(
      //     `yarn add --dev ${config.APP_DEV_DEPS.join(' ')}`,
      //     {cwd: PROJECT},
      //   ),
      // );

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
          }),
        ),
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
      //
      // await initWeb({
      //   APP,
      //   TEMPLATES,
      //   app,
      // });

      resolve();
    } catch (error) {
      console.log(error.stack);
      reject(error);
    }
  });
}
