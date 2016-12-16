import path from 'path';

import changeJSON from '../util/changeJSON';
import copy from '../util/copy';
import exec from '../util/exec';
import transform from '../util/transform';

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

      await run(
        'Create desktop package',
        async () => await transform(
          path.join(TEMPLATES, 'desktop/package.json'),
          transformTemplate.bind({app}),
          path.join(APP, 'desktop/package.json'),
        ),
      );

      await run(
        'Init desktop yarn',
        async () => await exec(
          'yarn init --yes',
          {cwd: path.join(APP, 'desktop')}
        ),
      );

      await run(
        'Install desktop yarn',
        async () => await exec(
          'yarn add ' + [
            'react',
            'react-dom',
          ].join(' '),
          {cwd: path.join(APP, 'desktop')}
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
