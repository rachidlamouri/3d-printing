const { buildMakeContainerWithDefaults } = require('../../lib/makeContainer');
const { center } = require('../../lib/utils');
const { makeShims } = require('../lib/makeShims');
const plan = require('./plan');

const defaultWallThickness = 0.8;
const defaults = {
  sideLengthMultiple: 1,
  outerHeight: 20,
  bottomThickness: 0.6,
};

const makeContainerWithFlexibleDimensions = buildMakeContainerWithDefaults({
  ...defaults,
  wallThickness: defaultWallThickness,
});

const makeContainerWithoutFlexing = buildMakeContainerWithDefaults({
  ...defaults,
  sideLengthMultiple: null,
  wallThickness: defaultWallThickness,
});

const map = {
  wallet: () => makeContainerWithFlexibleDimensions({
    innerWidth: 81.2,
    innerDepth: 14.6,
    outerHeight: 50,
  }),
  keys: () => makeContainerWithFlexibleDimensions({
    innerWidth: 40,
    innerDepth: 40,
    outerHeight: 40,
  }),
  chapstick: (chapstickDiameter = 16.4) => makeContainerWithFlexibleDimensions({
    innerWidth: chapstickDiameter,
    innerDepth: chapstickDiameter,
    outerHeight: 20,
  }),
  boundingBox: () => makeContainerWithoutFlexing({
    innerWidth: plan.boundingContainer.withTolerance.width,
    innerDepth: plan.boundingContainer.withTolerance.height,
    bottomClearance: Infinity,
    minBottomHoleSideLength: 0,
  }),
  shims: () => ({ entity: makeShims(plan.shimGroups) }),
};

const getParameterDefinitions = () => [
  { name: 'name', type: 'text' },
];

const main = ({ name }) => map[name]().entity.center(center);

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions,
  main,
};
