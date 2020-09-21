const { execSync } = require('child_process');
const glob = require('glob');
const _ = require('lodash');
const fs = require('fs');

const [arg] = process.argv.slice(2);

if (!fs.existsSync('build/')) {
  fs.mkdirSync('build/');
}

const filepaths = glob.sync('./src/**/*.main.js');
console.log('Found:', filepaths); // eslint-disable-line no-console

const update = (filepath) => {
  [
    '.amf',
    '.stl',
  ].forEach((extension) => {
    const output = filepath
      .replace(/\.\//, '')
      .replace(/\//g, '__')
      .replace(/src__/, 'build/')
      .replace(/\.main.js/, extension);
    const result = execSync(`"node_modules/.bin/openjscad" ${filepath} -o ${output}`);
    console.log(result.toString().replace('\n', '')); // eslint-disable-line no-console
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
}

filepaths.forEach(update);
