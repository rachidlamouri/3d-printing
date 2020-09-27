const {
  primitives3d: { cube },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const { center } = require('../lib/utils');
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
  boxInsert: () => {
    const outerWidth = 193;
    const outerDepth = 147;
    const height = 0.3;
    const wallThickness = 3;

    const outerPerimeter = difference(
      cube({
        size: [outerWidth, outerDepth, height],
        center,
      }),
      cube({
        size: [outerWidth - 2 * wallThickness, outerDepth - 2 * wallThickness, height],
        center,
      }),
    );

    const widthSpanningDivider = cube({
      size: [outerWidth, wallThickness, height],
      center,
    });

    const depthSpanningDivider = cube({
      size: [wallThickness, outerDepth, height],
      center,
    });

    const entity = union(
      outerPerimeter,
      widthSpanningDivider,
      depthSpanningDivider,
    );

    return { entity };
  },
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
