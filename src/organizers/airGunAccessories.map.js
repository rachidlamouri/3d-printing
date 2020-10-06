const { buildMakeBoxAndLidWithDefaults } = require('../lib/makeBoxAndLid');

const makeBoxAndLid = buildMakeBoxAndLidWithDefaults({
  bottomAndTopThickness: 0.4,
  wallThickness: 0.8,
  lidHeightPercentage: 0.4,
});

const map = {
  crosmanPro77Mag: () => makeBoxAndLid({
    innerWidth: 126,
    innerDepth: 50.5,
    innerHeight: 58,
  }).frontToBack,
  crosman357Mag: () => {
    const magDiameter = 38.6;
    const magHeight = 10.6;

    return makeBoxAndLid({
      innerWidth: 2 * magDiameter,
      innerDepth: magDiameter,
      innerHeight: 2 * magHeight,
    }).sideBySide;
  },
  crosmanPowermaster66Mag: () => makeBoxAndLid({
    innerWidth: 46,
    innerDepth: 52,
    innerHeight: 14,
  }).sideBySide,
  safeties: () => makeBoxAndLid({
    innerWidth: 105,
    innerDepth: 45,
    innerHeight: 30,
  }).frontToBack,
};

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions: () => [{ name: 'name', type: 'text' }],
  main: ({ name }) => map[name](),
};
