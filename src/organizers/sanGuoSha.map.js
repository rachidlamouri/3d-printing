const { buildMakeContainerWithDefaults } = require('../lib/makeContainer');

const defaultWallThickness = 1;
const defaults = {
  sideLengthMultiple: 1,
  bottomThickness: 0.3,
};

const makeContainerWithFlexibleDimensions = buildMakeContainerWithDefaults({
  ...defaults,
  wallThickness: defaultWallThickness,
});

const cardDepth = 93.5;
const containerHeight = 50;

const map = {
  extraCardsContainer: () => makeContainerWithFlexibleDimensions({
    innerWidth: cardDepth,
    innerDepth: 6.6,
    outerHeight: containerHeight,
  }),
  setupCardsContainer: () => makeContainerWithFlexibleDimensions({
    innerWidth: cardDepth,
    innerDepth: 13.6,
    outerHeight: containerHeight,
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
