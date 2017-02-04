import exec from '../util/exec';

export default function runWeb() {
  return new Promise(async (resolve, reject) => {
    try {
      exec('npm run webDev');
    } catch (error) {
      reject(error);
    }
  });
}
