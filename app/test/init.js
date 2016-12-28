/* global describe it after */
import colors from 'colors';
import path from 'path';
import should from 'should';
import 'babel-polyfill';
import fs from 'fs';
import _ from 'lodash';
import std from '../util/std';
import exec from '../util/exec';
import read from '../util/read';
import {bin} from '../../package.json';
import config from '../config';

function cbToPromise(fn) {
  return new Promise((resolve, reject) => {
    fn((error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

function stat(...paths) {
  return new Promise(async (resolve, reject) => {
    try {
      const _path = path.join(...paths);
      resolve(await cbToPromise(fs.stat.bind(null, _path)));
    } catch (error) {
      reject(error);
    }
  });
}

const APP_NAME = 'InitReactorsApp';
const CONTAINER_PATH = '/tmp';
const PROJECT_PATH = path.join(CONTAINER_PATH, APP_NAME);
const APP_PATH = path.join(PROJECT_PATH, 'app');
const DESKTOP_PATH = path.join(PROJECT_PATH, 'desktop');

let output = '';

describe('Init', () => {
  describe('Command', () => {
    it('should init app', async function() {
      this.timeout(1000 * 60 * 5);
      return new Promise(async (resolve, reject) => {
        try {
          const binPath = path.resolve(__dirname, '../..', bin.reactors);

          const io = std(
            `node ${binPath} init ${APP_NAME}`,
            {cwd: CONTAINER_PATH},
          );

          io.on('error', reject);

          io.on('message', (message) => {
            if (message.std === 'err') {
              console.log(colors.yellow(message.data.yellow));
            } else {
              console.log(colors.yellow(message.data.grey));
            }
          });

          io.on('done', ({out}) => {
            output = out;
            resolve();
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  describe('Output', () => {
    it('should have displayed init ok message', () => {
      should(output.trim()).endWith(config.INIT_OK_MSG);
    });
  });

  describe('Project', () => {
    it('should have created project directory', async () => {
      const stats = await stat(PROJECT_PATH);
      should(stats.isDirectory()).eql(true);
    });
  });

  describe('Abstract App', () => {
    describe('Directory', () => {
      it('should have created app directory', async () => {
        const stats = await stat(APP_PATH);
        should(stats.isDirectory()).eql(true);
      });
    });

    describe('Package.json', () => {
      let source, json;

      it('should get package', async () => {
        source = await read(path.join(APP_PATH, 'package.json'));
      });

      it('should be an object', () => {
        json = JSON.parse(source);
      });

      it('should have the right name', () => {
        should(json.name).eql(APP_NAME);
      });

      it('should have the right version', () => {
        should(json.version).eql('0.0.0');
      });

      it('should have the right dev dependencies', () => {
        should(_.keys(json.devDependencies)).eql(config.APP_DEV_DEPS);
      });

      it('should have the right dependencies', () => {
        should(_.keys(json.dependencies)).eql(config.APP_DEPS);
      });
    });

    describe('SRC Directory', () => {
      it('should have created src directory', async () => {
        const stats = await stat(APP_PATH, 'src');
        should(stats.isDirectory()).eql(true);
      });

      it('should have created App entry', async () => {
        const stats = await stat(APP_PATH, 'src/App.js');
        should(stats.isFile()).eql(true);
      });
    });
  });

  describe('Desktop native app', () => {
    it('should have created desktop directory', async () => {
      const stats = await stat(DESKTOP_PATH);
      should(stats.isDirectory()).eql(true);
    });
  });

  after('remove project', async () => {
    await exec(`rm -rf ${PROJECT_PATH}`);
  });
});
