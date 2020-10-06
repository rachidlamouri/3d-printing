const { makeBoxAndLid } = require('../lib/makeBoxAndLid');

const { box, lid, sideBySide } = makeBoxAndLid({
  innerWidth: 89,
  innerDepth: 64,
  innerHeight: 40,
  bottomAndTopThickness: 0.4,
  wallThickness: 0.8,
  lidHeightPercentage: 0.4,
});

const map = {
  box: () => box.csg,
  lid: () => lid.csg,
  sideBySide: () => sideBySide,
};

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions: () => [{ name: 'name', type: 'text' }],
  main: ({ name }) => map[name](),
};
