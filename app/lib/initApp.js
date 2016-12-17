import path from 'path';
import changeJSON from '../util/changeJSON';
import exec from '../util/exec';
import transform from '../util/transform';
import transformTemplate from '../lib/transformTemplate';
import run from './microRun';

export default function initWeb({
  APP,
  TEMPLATES,
  app,
}) {
  return new Promise(async (resolve, reject) => {
    try {
      await run(
        'Create app app directory',
        async () => await exec('mkdir -p app', {cwd: APP}),
      );

      await run(
        'Create App',
        async () => await transform(
          path.join(TEMPLATES, 'app/App.js'),
          transformTemplate.bind({app}),
          path.join(APP, 'app/App.js'),
        ),
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
