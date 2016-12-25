import {spawn} from 'child_process';

export default function exec (cmd, options = {}) {
  return new Promise((resolve, reject) => {
    const [entry, ...bits] = cmd.split(/\s+/);
    const ps = spawn(entry, bits, options);

    ps
      .on('error', reject)
      .on('exit', status => {
        process.stdin.unpipe(ps.stdin);
        process.stdin.end();
        if (status === 0) {
          return resolve();
        }
        reject(new Error(`Got status ${status}`));
      });

    ps.stdout.pipe(process.stdout);
    ps.stderr.pipe(process.stderr);
    process.stdin.pipe(ps.stdin);
  });
}
