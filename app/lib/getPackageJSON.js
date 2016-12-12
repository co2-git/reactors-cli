import path from 'path';
import read from './read';

export default function getPackageJSON() {
  return new Promise(async (resolve, reject) => {
    try {
      const packageJSON = JSON.parse(
        await read(path.join(process.cwd(), 'package.json'))
      );
      resolve(packageJSON);
    } catch (error) {
      reject(error);
    }
  });
}
