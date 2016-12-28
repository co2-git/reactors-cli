// @flow

import path from 'path';
import write from '../util/write';
import exec from '../util/exec';
import changeJSON from '../util/changeJSON';
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
