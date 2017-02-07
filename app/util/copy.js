import read from './read';
import write from './write';

export default function(source, target, options) {
  return new Promise(async (resolve, reject) => {
    try {
      await write(target, await read(source, options), options);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
