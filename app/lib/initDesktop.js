import path from 'path';

import changeJSON from '../util/changeJSON';
import exec from '../util/exec';
import transform from '../util/transform';
import write from '../util/write';

import run from './microRun';
import transformTemplate from './transformTemplate';

import config from '../config';

export default function initDesktop({
  PROJECT,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create electron main process file',
        async () => await transform(
          path.join(TEMPLATES, config.DESKTOP_MAIN_PROCESS_FILE),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.DESKTOP_MAIN_PROCESS_FILE),
        ),
      );

      await run(
        'Create desktop html',
        async () => await transform(
          path.join(TEMPLATES, config.DESKTOP_HTML_FILE),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.DESKTOP_HTML_FILE),
        ),
      );

      await run(
        'Create desktop JS',
        async () => await transform(
          path.join(TEMPLATES, config.DESKTOP_RENDERER_FILE),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.DESKTOP_RENDERER_FILE),
        ),
      );

      await run(
        'Update package.json',
        async () => await changeJSON(
          path.join(PROJECT, 'package.json'),
          (json) => {
            json.main = config.DESKTOP_MAIN_PROCESS_FILE;
            if (!json.scripts) {
              json.scripts = {};
            }
            json.scripts.babelDesktop = [
              'babel',
              '--no-babelrc',
              `--presets=${config.DESKTOP_BABEL_PRESETS.join(',')}`,
              `--out-dir=${config.DESKTOP_BABEL_OUT_DIR}`,
              'app'
            ].join(' ');
            json.scripts.babelDesktopWatch = json.scripts.babelDesktop +
              ' --watch';
          },
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
