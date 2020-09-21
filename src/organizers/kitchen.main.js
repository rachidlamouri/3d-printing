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
    measuringCups: makeContainer({
      innerWidth: 160,
      innerDepth: 90,
      outerHeight: 40,
      bottomClearance: 20,
      baseClearance: 20,
      xClearance: 20,
      yClearance: 20,
    }),
    chipClips: makeRepeatContainer({
      count: 6,
      innerWidth: 36,
      innerDepth: 85,
      outerHeight: 20,
    }),
  };

  const {
    entity,
  } = metaMap.chipClips;

  return entity;
};
