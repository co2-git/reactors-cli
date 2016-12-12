import os from 'os';
import exec from '../util/exec';
import bundle from '../lib/bundle';

export default function run(platform) {
  switch (platform) {
  case 'android':
  case 'ios':
    exec(`react-native run-${platform}`);
    break;
  case 'web':
  case 'desktop':
    bundle(platform);

    setTimeout(() => {
      if (platform === 'web') {
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
      } else if (platform === 'desktop') {
        exec('electron index.electron.js');
      }
    }, 5000);
    break;
  default:
    throw new Error('Unknown platform: ' + platform);
  }
}
