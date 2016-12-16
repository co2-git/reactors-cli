import exec from '../util/exec';
import path from 'path';
import run from './microRun';

export default function initMobile({
  APP,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create mobile directory',
        async () => await exec('mkdir mobile', {cwd: APP}),
      );

      await run(
        'Install React Native',
        async () => await exec(
          `react-native init ${app}`,
          {cwd: path.join(APP, 'mobile')},
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
