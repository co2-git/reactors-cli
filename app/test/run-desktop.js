/* global describe it after */
import colors from 'colors';
import path from 'path';
import should from 'should';
import 'babel-polyfill';
import fs from 'fs';
import {Server as WebSocketServer} from 'ws';
import exec from '../util/exec';
import write from '../util/write';
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

const APP = 'RunReactorsDesktop';
const CONTAINER = '/tmp';
const PATH = path.join(CONTAINER, APP);

describe.only('Run desktop', () => {
  describe('Init new app', () => {
    it('should init app', async function() {
      this.timeout(1000 * 60 * 5);
      return new Promise(async (resolve, reject) => {
        try {
          const binPath = path.resolve(__dirname, '../..', bin.reactors);
          await exec(`node ${binPath} init ${APP}`, {cwd: CONTAINER});
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  describe('Run', () => {
    let connected;

    it('should put new index', async () => {
      await exec('ls app', {cwd: path.join(PATH)});
      await write(
        path.join(PATH, 'app/App.js'),
        await read(path.resolve(
          __dirname,
          '../../templates/test/run-desktop-app.js',
        )),
      );
    });

    it('should start a web socket server', () => {
      const wss = new WebSocketServer({port: 8008});
      wss.on('connection', () => {
        connected = true;
      });
    });

    it('should launch run command', async function () {
      this.timeout(1000 * 60 * 5);
      return new Promise(async (resolve, reject) => {
        try {
          const binPath = path.resolve(__dirname, '../..', bin.reactors);
          exec(`node ${binPath} run desktop`, {cwd: PATH});
          setTimeout(resolve, 10000);
        } catch (error) {
          reject(error);
        }
      });
    });

    it('should have handshaked', function (done) {
      this.timeout(3500);
      setTimeout(() => {
        if (connected) {
          done();
        } else {
          done(new Error('Not connected'));
        }
      }, 2500);
    });
  });

  after('remove project', async () => {
    await exec(`rm -rf ${PATH}`);
  });
});
