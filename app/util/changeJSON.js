import read from './read';
import write from './write';

export default function changeJSON(file, changer) {
  return new Promise(async (resolve, reject) => {
    try {
      const content = await read(file);
      const json = JSON.parse(content);
      changer(json);
      await write(file, JSON.stringify(json, null, 2));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
