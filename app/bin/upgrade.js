import exec from '../lib/exec';
import _upgrade from '../lib/upgrade';

export default function upgrade() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Updating npm dependencies');
      await exec('npm install');

      console.log('Upgrading react-native');
      await exec('react-native upgrade');

      console.log('Upgrading reactors');
      await _upgrade();

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
