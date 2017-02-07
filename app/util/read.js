import fs from 'fs';

export default function read(file, options) {
  return new Promise((resolve, reject) => {
    let source = '';
    fs.createReadStream(file, options)
      .on('error', reject)
      .on('data', data => {
        source += data.toString();
      })
      .on('end', () => {
        resolve(source);
      });
  });
}
