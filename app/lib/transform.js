import read from './read';
import write from './write';

export default function(file, transformer, target) {
  return new Promise(async (resolve, reject) => {
    try {
      const source = await read(file);
      return write(target || file, transformer(source));
    } catch (error) {
      reject(error);
    }
  });
}
