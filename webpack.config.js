const path = require('path');
const glob = require('glob');
const _ = require('lodash');

const entries = _.keyBy(
  glob.sync('./src/**/*.js'),
  (filepath) => filepath.replace(/.\/src\//, '').replace(/\.js/, ''),
);

module.exports = {
  mode: 'development',
  entry: entries,
  output: {
    filename: '[name].jscad',
    path: path.resolve(__dirname, 'build'),
  },
};
