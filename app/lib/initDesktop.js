import changeJSON from '../util/changeJSON';
import config from '../config';
import copy from '../util/copy';
import path from 'path';
import run from './microRun';
import transform from '../util/transform';
import transformTemplate from './transformTemplate';

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
        'Create desktop JS dev',
        async () => await transform(
          path.join(TEMPLATES, config.DESKTOP_DEV_RENDERER_FILE),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.DESKTOP_DEV_RENDERER_FILE),
        ),
      );

      await run(
        'Create desktop webpack config',
        async () => await copy(
          path.join(TEMPLATES, config.DESKTOP_WEBPACK),
          path.join(PROJECT, config.DESKTOP_WEBPACK),
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
            json.scripts['babel:desktop'] = [
              'babel',
              '--no-babelrc',
              `--presets=${config.DESKTOP_BABEL_PRESETS.join(',')}`,
              `--out-dir=${config.DESKTOP_BABEL_OUT_DIR}`,
              'app'
            ].join(' ');
            json.scripts['babel:desktop:watch'] =
              json.scripts['babel:desktop'] + ' --watch';
          },
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
