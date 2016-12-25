import {spawn} from 'child_process';
import EventEmitter from 'events';

export default function std (cmd, options = {}) {
  const emitter = new EventEmitter();

  const [entry, ...bits] = cmd.split(/\s+/);
  const ps = spawn(entry, bits, options);

  const out = [];
  const err = [];

  ps
    .on('error', (error) => emitter.emit('error', error))
    .on('exit', (status) => {
      process.stdin.unpipe(ps.stdin);
      process.stdin.end();
      if (status === 0) {
        emitter.emit('done', {err: err.join(''), out: out.join('')});
      } else {
        emitter.emit('error', new Error(`Got status ${status}`));
      }
    });

  ps.stdout.on('data', (data) => {
    out.push(data.toString());
    emitter.emit('message', {
      std: 'out',
      data: data.toString(),
    });
  });

  ps.stderr.on('data', (data) => {
    err.push(data.toString());
    emitter.emit('message', {
      std: 'err',
      data: data.toString(),
    });
  });

  process.stdin.pipe(ps.stdin);

  return emitter;
}
