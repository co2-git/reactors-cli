// @flow

import path from 'path';
import write from '../util/write';
import exec from '../util/exec';
import transform from '../util/transform';
import transformTemplate from '../lib/transformTemplate';
import run from './microRun';
import config from '../config';

export default function initWeb({
  APP,
  PROJECT,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // await run(
      //   'Create app app directory',
      //   async () => await exec('mkdir -p app', {cwd: PROJECT}),
      // );

      await run(
        'Create package.json',
        async () => await write(
          path.join(PROJECT, 'package.json'),
          JSON.stringify({
            name: app,
            version: '0.0.0',
            scripts: {},
          }, null, 2),
        ),
      );

      await run(
        'Init yarn',
        async () => await exec('yarn init --yes', {cwd: PROJECT}),
      );

      await run(
        'Install app yarn dev',
        async () => await exec(
          `yarn add --dev ${config.APP_DEV_DEPS.join(' ')}`,
          {cwd: PROJECT},
        ),
      );

      await run(
        'Install app yarn',
        async () => await exec(
          `yarn add ${config.APP_DEPS.join(' ')}`,
          {cwd: PROJECT},
        ),
      );

      await run(
        'Create app directory',
        async () => await exec('mkdir app', {cwd: PROJECT}),
      );

      await run(
        'Create App',
        async () => await transform(
          path.join(TEMPLATES, 'app/App.js'),
          transformTemplate.bind({app}),
          path.join(PROJECT, 'app/App.js'),
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
