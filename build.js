const { execSync } = require('child_process');
const glob = require('glob');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const [arg] = process.argv.slice(2);

if (!fs.existsSync('build/')) {
  fs.mkdirSync('build/');
}

const filepaths = [
  ...glob.sync('./src/**/*.map.js'),
  ...glob.sync('./src/**/*.main.js'),
  ...glob.sync('./src/**/*.object.js'),
];
console.log('Found:', filepaths); // eslint-disable-line no-console

const update = (filepath) => {
  const supportedFileTypes = filepath.endsWith('.demo.js')
    ? ['.amf']
    : ['.amf', '.stl'];

  if (filepath.endsWith('.map.js')) {
    const cacheId = path.join(__dirname, filepath);
    delete require.cache[cacheId];
    let objectNames;
    try {
      ({ objectNames } = require(filepath)); // eslint-disable-line import/no-dynamic-require, global-require
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
      return;
    }

    const subfolder = filepath
      .replace(/\.\//, '')
      .replace(/\//g, '_')
      .replace(/src_/, 'build/')
      .replace(/\.map.js/, '/');

    if (!fs.existsSync(subfolder)) {
      fs.mkdirSync(subfolder);
    }

    objectNames.forEach((objectName) => {
      supportedFileTypes.forEach((extension) => {
        const output = `${subfolder}${objectName}${extension}`;
        const command = `"node_modules/.bin/openjscad" ${filepath} --name ${objectName} -o ${output}`;
        console.log(command); // eslint-disable-line no-console
        const result = execSync(command);
        console.log(result.toString().replace('\n', '')); // eslint-disable-line no-console
      });
    });

    return;
  }

  supportedFileTypes.forEach((extension) => {
    const filename = path.basename(filepath);
    const [objectName] = filename.split('.');
    const subfolder = filepath
      .replace(/^\.\//, '')
      .replace(new RegExp(`/${filename}`), '')
      .replace(/\//g, '_')
      .replace(/^src_/, 'build/');

    if (!fs.existsSync(subfolder)) {
      fs.mkdirSync(subfolder);
    }

    const output = `${subfolder}/${objectName}${extension}`;

    const command = `"node_modules/.bin/openjscad" ${filepath} -o ${output}`;
    console.log(`  ${command}`); // eslint-disable-line no-console
    const result = execSync(command);
    console.log(`    ${result.toString().replace('\n', '').replace(' -> ', '\n    -> ')}`); // eslint-disable-line no-console
  });
  console.log(); // eslint-disable-line no-console
};

if (arg === '--watch') {
  filepaths.forEach((filepath) => {
    const debouncedUpdate = _.debounce(update, 100);

    fs.watch(filepath, { encoding: 'buffer' }, (eventType) => {
      console.log(eventType, filepath); // eslint-disable-line no-console

      debouncedUpdate(filepath);
    });
  });

  console.log('Watching ...'); // eslint-disable-line no-console
} else {
  filepaths.forEach(update);
}
