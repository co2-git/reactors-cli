import path from 'path';
import read from './read';

export default function getReactorsConfig() {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(JSON.parse(
        await read(path.join(process.cwd(), 'reactors.json'))
      ));
    } catch (error) {
      reject(error);
    }
  });
}
