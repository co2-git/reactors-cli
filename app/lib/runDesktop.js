import exec from '../util/exec';

export default function runDesktop() {
  return new Promise(async (resolve, reject) => {
    try {
      await exec('electron index.electron.js');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
