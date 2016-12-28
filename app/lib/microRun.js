import colors from 'colors';
import logger from './logger';

export default function microRun(label, runner) {
  return new Promise(async (resolve, reject) => {
    try {
      await logger(colors.italic(label));
      await runner();
      await logger.ok(label);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
