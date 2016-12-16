import exec from '../util/exec';
import run from './microRun';

export default function initWeb({
  APP,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create web directory',
        async () => await exec('mkdir web', {cwd: APP}),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
