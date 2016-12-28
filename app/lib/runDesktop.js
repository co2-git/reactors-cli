import path from 'path';
import exec from '../util/exec';

export default function runDesktop() {
  return new Promise(async (resolve, reject) => {
    try {
      const presets = [
        'react',
        'electron',
      ].map(
        (preset) => `babel-preset-${preset}`
      );
      const cmd = `babel \
--presets=${presets.join(',')} \
--out-dir=dist-desktop \
app`;
      console.log({cmd});
      await exec(cmd);
      exec('electron index.desktop.mainProcess.js');
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
