const { buildMakeContainerWithDefaults } = require('../lib/makeContainer');
const { buildMakeRepeatContainerWithDefaults } = require('../lib/makeRepeatContainer');

const defaultWallThickness = 1;
const defaults = {
  sideLengthMultiple: 1,
  bottomThickness: 0.5,
};

const makeContainer = buildMakeContainerWithDefaults({
  minWallThickness: defaultWallThickness,
  ...defaults,
});

const makeRepeatContainer = buildMakeRepeatContainerWithDefaults({
  dividerThickness: defaultWallThickness,
  ...defaults,
});

module.exports.main = () => {
  const metaMap = {
    ibuprofen: makeContainer({
      innerWidth: 108,
      innerDepth: 58,
      outerHeight: 30,
    }),
    chapstick: makeRepeatContainer({
      count: 2,
      innerWidth: 17,
      innerDepth: 68,
      outerHeight: 8,
      minBottomHoleSideLength: 1,
    }),
    mints: makeRepeatContainer({
      count: 6,
      innerWidth: 8,
      innerDepth: 32,
      outerHeight: 20,
      bottomClearance: 4,
      minBottomHoleSideLength: 2,
    }),
    toothbrushBrush: makeRepeatContainer({
      count: 2,
      innerWidth: 15,
      innerDepth: 88,
      outerHeight: 20,
      minBottomHoleSideLength: 1,
    }),
    neosporin: makeContainer({
      innerWidth: 97,
      innerDepth: 22,
      outerHeight: 20,
      minBottomHoleSideLength: 1,
    }),
    sewingKit: makeContainer({
      innerWidth: 71,
      innerDepth: 19,
      outerHeight: 30,
    }),
    tapeMeasure: makeContainer({
      innerWidth: 52,
      innerDepth: 16,
      outerHeight: 30,
    }),
    bandaids: makeContainer({
      innerWidth: 100,
      innerDepth: 40,
      outerHeight: 30,
      bottomClearance: 10,
    }),
  };

  const {
    entity,
  } = metaMap.sewingKit;

  return entity;
};
