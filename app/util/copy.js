import read from './read';
import write from './write';

export default function(source, target) {
  return new Promise(async (resolve, reject) => {
    try {
      await write(target, await read(source));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
