import exec from '../util/exec';

export default function runDesktop() {
  return new Promise(async (resolve, reject) => {
    try {
      exec('npm run babelDesktopWatch', {cwd: process.cwd() + '/app'});
      exec('electron desktop');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
