import exec from '../util/exec';
import run from './microRun';

const runPackager = () => new Promise(async (resolve, reject) => {
  try {
    await run(
      'Start react-native packager',
      () => new Promise(async (resolvePackage, rejectPackager) => {
        try {
          await exec('yarn start');
          resolvePackage();
        } catch (error) {
          rejectPackager(error);
        }
      })
    );
  } catch (error) {
    reject(error);
  }
});

export default runPackager;
