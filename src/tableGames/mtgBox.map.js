const { makeBoxAndLid } = require('../lib/makeBoxAndLid');

const { box, lid } = makeBoxAndLid({
  innerWidth: 89,
  innerDepth: 64,
  innerHeight: 40,
  bottomAndTopThickness: 0.1,
  wallThickness: 0.8,
  lidHeightPercentage: 0.1,
});

const map = {
  box: () => box,
  lid: () => lid,
};

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions: () => [{ name: 'name', type: 'text' }],
  main: ({ name }) => map[name]().csg,
};
