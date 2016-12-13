import path from 'path';
import getReactorsConfig from '../lib/getReactorsConfig';
import getPackageJSON from './getPackageJSON';
import addKeysToGradleBuild from './addKeysToGradleBuild';
import read from './read';
import write from './write';

const gradlePropertiesFilePath = path.join(
  process.env.HOME,
  '.gradle/gradle.properties',
);

export default function signAndroid() {
  return new Promise(async (resolve, reject) => {
    try {
      const {android: {release}} = await getReactorsConfig();

      const {name} = await getPackageJSON();

      const existingGradleProperties = await read(gradlePropertiesFilePath);

      const appIsAlreadyStored = new RegExp(
        `${name.toUpperCase()}_RELEASE_STORE_FILE`
      );

      if (appIsAlreadyStored.test(existingGradleProperties)) {
        console.log('App already signed in gradle properties - skipping');
      } else {
        const properties = `
${name.toUpperCase()}_RELEASE_STORE_FILE=my-release-key.keystore
${name.toUpperCase()}_RELEASE_KEY_ALIAS=${name}
${name.toUpperCase()}_RELEASE_STORE_PASSWORD=${release.storePassword}
${name.toUpperCase()}_RELEASE_KEY_PASSWORD=${release.keyPassword}
  `;

        await write(gradlePropertiesFilePath, properties, {flags: 'a+'});

        console.log('Keys added to gradle global peroperties');
      }

      await addKeysToGradleBuild(name);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
