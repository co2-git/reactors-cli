/* global describe it */
import should from 'should';
import 'babel-polyfill';
import read from '../util/read';
import std from '../util/std';
import {bin, name, version} from '../../package.json';

describe('Usage', () => {
  it('should show usage', async () => new Promise(async (resolve, reject) => {
    try {
      const README = await read('README.md');

      const io = std(`node ${bin.reactors}`);

      io.on('error', reject);

      io.on('done', ({out}) => {
        should(out).eql(`${name} ${version}

${README}
`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  }));
});
