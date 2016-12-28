import exec from '../util/exec';
import run from './microRun';

export default function initMobile({CONTAINER, app}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Install React Native',
        async () => await exec(
          `react-native init ${app}`,
          {cwd: CONTAINER},
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
