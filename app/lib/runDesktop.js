import exec from '../util/exec';

export default function runDesktop() {
  return new Promise(async (resolve, reject) => {
    try {
      exec('npm run babelDesktopWatch');
      exec('electron desktop/main.js');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
