import exec from '../util/exec';

export default function runWeb() {
  return new Promise(async (resolve, reject) => {
    try {
      exec('./node_modules/.bin/webpack --watch');
      exec('./node_modules/.bin/webpack-dev-server');
      setTimeout(async () => {
        console.log('http://localhost:8080/index.web.html');
      }, 1000 * 60 * 2);
    } catch (error) {
      reject(error);
    }
  });
}
