import exec from './exec';

export default function yarnInstall (cwd, ...deps) {
  return exec('yarn add ' + deps.join(' '), {cwd});
}
