import path from 'path';
import copy from '../util/copy';
import exec from '../util/exec';
import run from './microRun';

export default function initMobile({CONTAINER, TEMPLATES, app}) {
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

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
