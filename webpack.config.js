const path = require('path');
const glob = require('glob');
const _ = require('lodash');

const entries = (
  _(glob.sync('./src/**/*.main.js'))
    .keyBy((filepath) => filepath.replace(/.\/src\//, '').replace(/\.js/, ''))
    .mapValues((filepath) => [
      './src/lib/bootstrap',
      './src/lib/bootstrapWindow',
      filepath,
    ])
    .value()
);

module.exports = {
  mode: 'development',
  entry: entries,
  output: {
    filename: '[name].jscad',
    path: path.resolve(__dirname, 'build'),
  },
};
