const { sizeToMeta } = require('./lib/utils');

module.exports = {
  miniCard: sizeToMeta([
    42,
    64,
    0.5,
  ]),
};
