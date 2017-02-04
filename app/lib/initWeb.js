import changeJSON from '../util/changeJSON';
import config from '../config';
import exec from '../util/exec';
import path from 'path';
import run from './microRun';
import transform from '../util/transform';
import transformTemplate from './transformTemplate';

export default function initWeb({
  PROJECT,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create web directory',
        async () => await exec('mkdir web', {cwd: PROJECT}),
      );

      await run(
        'Create webpack config file',
        async () => await transform(
          path.join(TEMPLATES, config.WEB_WEBPACK),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.WEB_WEBPACK),
        ),
      );

      await run(
        'Create web index html',
        async () => await transform(
          path.join(TEMPLATES, config.WEB_HTML_FILE),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.WEB_HTML_FILE),
        ),
      );

      await run(
        'Create web index js',
        async () => await transform(
          path.join(TEMPLATES, config.WEB_RENDER_FILE),
          transformTemplate.bind({app}),
          path.join(PROJECT, config.WEB_RENDER_FILE),
        ),
      );

      await run(
        'Update package.json',
        async () => await changeJSON(
          path.join(PROJECT, 'package.json'),
          (json) => {
            if (!json.scripts) {
              json.scripts = {};
            }
            json.scripts.webDev = 'webpack-dev-server --progress --open';
          },
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
