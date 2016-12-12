import os from 'os';
import exec from '../util/exec';

export default function runWeb() {
  switch (os.platform()) {
  case 'darwin':
    exec('open index.html');
    break;
  case 'linux':
    exec('x-www-browser index.html');
    break;
  default:
    throw new Error('Platform not supported: ' + os.platform());
  }
}
