import exec from '../util/exec';
import bundle from '../lib/bundle';

import runDesktop from './runDesktop';
import runWeb from './runWeb';

export default function run(platform) {
  switch (platform) {
  case 'android':
  case 'ios': {
    exec(`react-native run-${platform}`);
  }
    break;

  case 'web': {
    bundle('web');
    setTimeout(runWeb, 5000);
  }
    break;

  case 'desktop': {
    // bundle('desktop');
    setTimeout(runDesktop, 5000);
  }
    break;

  default:
    throw new Error('Unknown platform: ' + platform);
  }
}
