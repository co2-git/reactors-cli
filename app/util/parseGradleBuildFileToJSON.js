import path from 'path';
import read from './read';
import write from './write';

export default function parseGradleBuildFileToJSON(name) {
  return new Promise(async (resolve, reject) => {
    try {
      let source = await read(
        path.join(process.cwd(), 'android/app/build.gradle'),
      );

      const lines = source.split(/\n/);
      const newLines = [];

      let defaultConfig = false;
      let buildTypes = false;
      let release = false;
      let putSigningConfigs = false;
      let count = 0;

      for (const line of lines) {
        switch (true) {

        case putSigningConfigs: {
          newLines.push(`
    signingConfigs {
        release {
            storeFile file(${name.toUpperCase()}_RELEASE_STORE_FILE)
            storePassword ${name.toUpperCase()}_RELEASE_STORE_PASSWORD
            keyAlias ${name.toUpperCase()}_RELEASE_KEY_ALIAS
            keyPassword ${name.toUpperCase()}_RELEASE_KEY_PASSWORD
        }
    }
`);
          putSigningConfigs = false;
        }
          break;

        case defaultConfig: {
          switch (true) {

          case /\{$/.test(line.trim()): {
            count++;
          }
            break;

          case (/\}$/.test(line.trim())): {
            if (count) {
              count--;
            } else {
              defaultConfig = false;
              count = 0;
              putSigningConfigs = true;
            }
          }
            break;
          }
        }
          break;

        case (/defaultConfig \{/.test(line)): {
          defaultConfig = true;
        }
          break;

        case buildTypes: {
          switch (true) {
          case (/release \{$/.test(line.trim())): {
            release = true;
          }
            break;

          case release: {
            switch (true) {
            case /\{$/.test(line.trim()): {
              count++;
            }
              break;

            case (/\}$/.test(line.trim())): {
              if (count) {
                count--;
              } else {
                release = false;
                buildTypes = false;
                count = 0;
                newLines.push(
                  '            signingConfig signingConfigs.release'
                );
              }
            }
              break;
            }
          }
            break;
          }
        }
          break;

        case (/buildTypes \{$/.test(line.trim())): {
          buildTypes = true;
        }
          break;
        }

        newLines.push(line);
      }

      return write(
        path.join(process.cwd(), 'android/app/build.gradle'),
        newLines.join('\n'),
      );
    } catch (error) {
      reject(error);
    }
  });
}
