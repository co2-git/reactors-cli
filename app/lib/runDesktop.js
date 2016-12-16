import exec from '../util/exec';

export default function runDesktop() {
  return new Promise(async (resolve, reject) => {
    try {
      exec('npm run babel', {cwd: process.cwd() + '/desktop'});
      exec('electron desktop');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
