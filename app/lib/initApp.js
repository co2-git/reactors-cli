import path from 'path';
import changeJSON from '../util/changeJSON';
import exec from '../util/exec';
import transform from '../util/transform';
import transformTemplate from '../lib/transformTemplate';
import run from './microRun';
import desktopJSON from '../../templates/desktop/package.json';

export default function initWeb({
  APP,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create app app directory',
        async () => await exec('mkdir -p app/src', {cwd: APP}),
      );

      await run(
        'Create app package',
        async () => await transform(
          path.join(TEMPLATES, 'app/package.json'),
          transformTemplate.bind({app}),
          path.join(APP, 'app/package.json'),
        ),
      );

      await run(
        'Init app yarn',
        async () => await exec(
          'yarn init --yes',
          {cwd: path.join(APP, 'app')}
        ),
      );

      await run(
        'Install app yarn',
        async () => await exec(
          'yarn add ' + [
            'babel-cli',
            'babel-preset-electron',
            'babel-preset-react',
            'react',
          ].join(' '),
          {cwd: path.join(APP, 'app')}
        ),
      );

      await run(
        'Create App',
        async () => await transform(
          path.join(TEMPLATES, 'app/src/App.js'),
          transformTemplate.bind({app}),
          path.join(APP, 'app/src/App.js'),
        ),
      );

      const babelDesktop = 'babel ' +
        `--presets=${desktopJSON.babel.presets.join(',')} ` +
        '--out-dir ../desktop/dist/ ' +
        'src';

      const babelDesktopWatch = 'babel ' +
        '--watch ' +
        `--presets=${desktopJSON.babel.presets.join(',')} ` +
        '--out-dir ../desktop/dist/ ' +
        'src';

      await run(
        'Create babel npm commands',
        async () => await changeJSON(
          path.join(APP, 'app/package.json'),
          (json) => {
            console.log({json});
            json.scripts = {
              ...json.scripts,
              babelDesktop,
              babelDesktopWatch,
            };
          },
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
