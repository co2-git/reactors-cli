import path from 'path';
import exec from '../util/exec';

export default function runWeb() {
  return new Promise(async (resolve, reject) => {
    try {
      await exec('webpack');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
