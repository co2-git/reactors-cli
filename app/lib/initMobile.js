import path from 'path';
import copy from '../util/copy';
import exec from '../util/exec';
import transform from '../util/transform';
import transformTemplate from '../lib/transformTemplate';
import run from './microRun';

export default function initMobile({CONTAINER, PROJECT, TEMPLATES, app}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Install React Native',
        async () => await exec(
          `react-native init ${app}`,
          {cwd: CONTAINER},
        ),
      );

      await run(
        'Install RN Cli config',
        async () => copy(
          path.join(TEMPLATES, 'rn-cli.config.js'),
          path.join(CONTAINER, app, 'rn-cli.config.js'),
        ),
      );

      await run(
        'Update iOS index',
        async () => await transform(
          path.join(TEMPLATES, 'index.mobile.js'),
          transformTemplate.bind({app}),
          path.join(PROJECT, 'index.ios.js'),
        ),
      );

      await run(
        'Update Android index',
        async () => await transform(
          path.join(TEMPLATES, 'index.mobile.js'),
          transformTemplate.bind({app}),
          path.join(PROJECT, 'index.android.js'),
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
