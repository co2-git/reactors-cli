import read from './read';
import write from './write';

export default function(source, target) {
  return new Promise(async (resolve, reject) => {
    try {
      return write(target, await read(source));
    } catch (error) {
      reject(error);
    }
  });
}
