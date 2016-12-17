import 'babel-polyfill';
import path from 'path';

import exec from '../util/exec';
import transform from '../util/transform';
import write from '../util/write';

import initApp from './initApp';
import initDesktop from './initDesktop';
import initMobile from './initMobile';
import initWeb from './initWeb';
import run from './microRun';
import transformTemplate from './transformTemplate';

import pkg from '../../package.json';

export default function init(app: string, context: string): Promise<void> {
  const TEMPLATES = path.resolve(__dirname, '../../templates');
  const CONTAINER = context || process.cwd();
  const APP = path.join(CONTAINER, app);

  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create app directory',
        async () => {
          try {
            await exec(`mkdir ${app}`, {cwd: CONTAINER});
          } catch (error) {
            throw new Error('Directory exists');
          }
        }
      );

      await run(
        'Create dist directory',
        async () => await exec('mkdir dist', {cwd: APP}),
      );

      await run(
        'Create README',
        async () => await transform(
          path.join(TEMPLATES, 'README.md'),
          transformTemplate.bind({app}),
          path.join(APP, 'README.md'),
        ),
      );

      await run(
        'Create reactors.json',
        async () => await write(
          path.join(APP, 'reactors.json'),
          JSON.stringify({version: pkg.version}),
        ),
      );

      await run(
        'Create desktop package.json',
        async () => await write(
          path.join(APP, 'package.json'),
          JSON.stringify({
            name: app,
            version: '0.0.0',
            scripts: {
              babelDesktop: 'babel ' +
                '--presets=react,electron ' +
                '--out-dir dist/desktop/ ' +
                'app',
              babelDesktopWatch: 'babel ' +
                '--watch ' +
                '--presets=react,electron ' +
                '--out-dir dist/desktop/ ' +
                'app'
            }
          }, null, 2),
        ),
      );

      await run(
        'Init yarn',
        async () => await exec('yarn init --yes', {cwd: APP}),
      );

      await run(
        'Install app yarn',
        async () => await exec(
          'yarn add ' + [
            'babel-cli',
            'babel-preset-electron',
            'babel-preset-react',
            'react-dom',
            'react',
            'reactors',
          ].join(' '),
          {cwd: APP}
        ),
      );

      await initApp({
        APP,
        TEMPLATES,
        app,
      });

      await initDesktop({
        APP,
        TEMPLATES,
        app,
      });

      await initMobile({
        APP,
        TEMPLATES,
        app,
      });

      await initWeb({
        APP,
        TEMPLATES,
        app,
      });

      resolve();
    } catch (error) {
      console.log(error.stack);
      reject(error);
    }
  });
}
