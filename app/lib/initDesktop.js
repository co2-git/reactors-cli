import path from 'path';

import copy from '../util/copy';
import exec from '../util/exec';
import transform from '../util/transform';
import write from '../util/write';

import run from './microRun';
import transformTemplate from './transformTemplate';

export default function initDesktop({
  DESKTOP,
  PROJECT,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // await run(
      //   'Create desktop directory',
      //   async () => await exec('mkdir desktop', {cwd: PROJECT}),
      // );

      // await run(
      //   'Create desktop package.json',
      //   async () => await write(
      //     path.join(DESKTOP, 'package.json'),
      //     JSON.stringify({
      //       name: app,
      //       version: '0.0.0',
      //       main: 'main.js',
      //     }, null, 2),
      //   ),
      // );

      // await run(
      //   'Init yarn',
      //   async () => await exec('yarn init --yes', {cwd: DESKTOP}),
      // );
      //
      // await run(
      //   'Install app yarn',
      //   async () => await exec(
      //     'yarn add ' + [
      //       'react-dom',
      //     ].join(' '),
      //     {cwd: DESKTOP},
      //   ),
      // );

      await run(
        'Create electron main process file',
        async () => await copy(
          path.join(TEMPLATES, 'desktop/main.js'),
          path.join(PROJECT, 'index.desktop.mainProcess.js'),
        ),
      );

      await run(
        'Create desktop html',
        async () => await transform(
          path.join(TEMPLATES, 'desktop/index.html'),
          transformTemplate.bind({app}),
          path.join(PROJECT, 'index.desktop.html'),
        ),
      );

      await run(
        'Create desktop JS',
        async () => await copy(
          path.join(TEMPLATES, 'desktop/index.js'),
          path.join(PROJECT, 'index.desktop.js'),
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
