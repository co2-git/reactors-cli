import path from 'path';

import copy from '../util/copy';
import exec from '../util/exec';
import transform from '../util/transform';
import write from '../util/write';

import run from './microRun';
import transformTemplate from './transformTemplate';

export default function initDesktop({
  APP,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create desktop directory',
        async () => await exec('mkdir desktop', {cwd: APP}),
      );

      await run(
        'Create desktop package.json',
        async () => await write(
          path.join(APP, 'desktop/package.json'),
          JSON.stringify({name: app, version: '0.0.0'}, null, 2),
        ),
      );

      await run(
        'Create desktop entry point',
        async () => await copy(
          path.join(TEMPLATES, 'desktop/main.js'),
          path.join(APP, 'desktop/main.js'),
        ),
      );

      await run(
        'Create desktop html',
        async () => await transform(
          path.join(TEMPLATES, 'desktop/index.html'),
          transformTemplate.bind({app}),
          path.join(APP, 'desktop/index.html'),
        ),
      );

      await run(
        'Create desktop JS',
        async () => await copy(
          path.join(TEMPLATES, 'desktop/index.js'),
          path.join(APP, 'desktop/index.js'),
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
