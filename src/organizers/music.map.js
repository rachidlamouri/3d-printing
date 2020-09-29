const { buildMakeRepeatContainerWithDefaults } = require('../lib/makeRepeatContainer');

const defaultWallThickness = 1;
const defaults = {
  sideLengthMultiple: 1,
  bottomThickness: 0.3,
};

const makeRepeatContainer = buildMakeRepeatContainerWithDefaults({
  ...defaults,
  dividerThickness: defaultWallThickness,
});

const map = {
  picks: () => makeRepeatContainer({
    count: 6,
    innerWidth: 1.2,
    innerDepth: 26.4,
    outerHeight: 14,
    minBottomHoleSideLength: 1,
    dividerThickness: 2,
  }),
};

const getParameterDefinitions = () => [
  { name: 'name', type: 'text' },
];

const main = ({ name }) => map[name]().entity;

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions,
  main,
};
