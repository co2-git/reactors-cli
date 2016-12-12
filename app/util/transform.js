import read from './read';
import write from './write';

export default function transform(file, transformer, target) {
  return new Promise(async (resolve, reject) => {
    try {
      const source = await read(file);
      if (/README/.test(file)) {
        console.log('..............');
      }
      await write(target || file, transformer(source));
      if (/README/.test(file)) {
        console.log('..............');
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
