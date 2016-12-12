import path from 'path';
import getReactorsConfig from './getReactorsConfig';
import getPackageJSON from './getPackageJSON';
import parseGradleBuildFileToJSON from './parseGradleBuildFileToJSON';
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
        return reject(new Error('App already signed in gradle properties'));
      }

      const properties = `
${name.toUpperCase()}_RELEASE_STORE_FILE=my-release-key.keystore
${name.toUpperCase()}_RELEASE_KEY_ALIAS=${name}
${name.toUpperCase()}_RELEASE_STORE_PASSWORD=${release.storePassword}
${name.toUpperCase()}_RELEASE_KEY_PASSWORD=${release.keyPassword}
`;

      await write(gradlePropertiesFilePath, properties, {flags: 'a+'});

      await parseGradleBuildFileToJSON(name);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
