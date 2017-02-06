import exec from '../util/exec';
import config from '../config';

export default function runDesktop() {
  return new Promise(async (resolve, reject) => {
    try {
      const presets = config.DESKTOP_BABEL_PRESETS.map(
        (preset) => `babel-preset-${preset}`,
      );
      const cmd = `babel \
--no-babelrc \
--presets=${presets.join(',')} \
--out-dir=${config.DESKTOP_BABEL_OUT_DIR} \
app`;
      await exec(cmd);
      exec(`electron ${config.DESKTOP_MAIN_PROCESS_FILE}`);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
