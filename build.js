const { execSync } = require('child_process');
const glob = require('glob');
const _ = require('lodash');
const fs = require('fs');

const [arg] = process.argv.slice(2);

if (!fs.existsSync('build/')) {
  fs.mkdirSync('build/');
}

const filepaths = [
  ...glob.sync('./src/**/*.main.js'),
  ...glob.sync('./src/**/*.object.js'),
  ...glob.sync('./src/**/*.demo.js'),
];
console.log('Found:', filepaths); // eslint-disable-line no-console

const update = (filepath) => {
  const supportedFileTypes = filepath.endsWith('.demo.js')
    ? ['.amf']
    : ['.amf', '.stl'];

  supportedFileTypes.forEach((extension) => {
    const output = filepath
      .replace(/\.\//, '')
      .replace(/\//g, '__')
      .replace(/src__/, 'build/')
      .replace(/\.(main|object).js/, extension)
      .replace(/\.demo.js/, `.demo.${extension}`);

    const command = `"node_modules/.bin/openjscad" ${filepath} -o ${output}`;
    console.log(command); // eslint-disable-line no-console
    const result = execSync(command);
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

  console.log('Watching ...'); // eslint-disable-line no-console
} else {
  filepaths.forEach(update);
}
