// @flow

import path from 'path';
import exec from '../util/exec';
import transform from '../util/transform';
import transformTemplate from '../lib/transformTemplate';
import run from './microRun';

type $props = {
  PROJECT: string,
  TEMPLATES: string,
  app: string,
};

export default function initWeb({
  PROJECT,
  TEMPLATES,
  app,
}: $props): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
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
