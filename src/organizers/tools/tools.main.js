const { buildMakeContainerWithDefaults } = require('../../lib/makeContainer');

const defaultWallThickness = 1;
const defaults = {
  sideLengthMultiple: 5,
  outerHeight: 20,
  bottomThickness: 0.6,
};

const makeContainerWithFlexibleDimensions = buildMakeContainerWithDefaults({
  ...defaults,
  wallThickness: defaultWallThickness,
});

const makeContainerWithFlexibleWalls = buildMakeContainerWithDefaults({
  ...defaults,
  minWallThickness: defaultWallThickness,
});

module.exports.main = () => {
  const metaMap = {
    electricalTape: makeContainerWithFlexibleDimensions({
      innerWidth: 55,
      innerDepth: 20,
      outerHeight: 25,
      xClearance: 12,
      yClearance: 5,
      baseClearance: 12,
      bottomClearance: 5,
    }),
    electricalWire: makeContainerWithFlexibleDimensions({
      innerWidth: 56,
      innerDepth: 21,
      outerHeight: 25,
      xClearance: 5,
      yClearance: 5,
      baseClearance: 10,
      bottomClearance: 5,
    }),
    solderingWire: makeContainerWithFlexibleDimensions({
      innerWidth: 56,
      innerDepth: 21,
      outerHeight: 25,
      xClearance: 5,
      yClearance: 5,
      baseClearance: 10,
      bottomClearance: 10,
    }),
    solderingWick: makeContainerWithFlexibleDimensions({
      innerWidth: 51,
      innerDepth: 13,
      outerHeight: 30,
      bottomClearance: 10,
      xClearance: 20,
      baseClearance: 10,
      minBottomHoleSideLength: 1,
    }),
    blueTape: makeContainerWithFlexibleDimensions({
      innerWidth: 110,
      innerDepth: 50,
      outerHeight: 50,
      bottomClearance: 8,
      baseClearance: 16,
      xClearance: 16,
      yClearance: 8,
    }),
    measuringTape: makeContainerWithFlexibleDimensions({
      innerWidth: 87,
      innerDepth: 50,
      outerHeight: 50,
      baseClearance: 25,
      xClearance: 10,
      yClearance: 10,
      bottomClearance: 8,
    }),
    flashlight: makeContainerWithFlexibleDimensions({
      innerWidth: 38,
      innerDepth: 38,
      outerHeight: 30,
      bottomClearance: 8,
      baseClearance: 8,
      xClearance: 8,
      yClearance: 8,
    }),
    utilityKnife: makeContainerWithFlexibleDimensions({
      innerWidth: 40,
      innerDepth: 24,
      outerHeight: 50,
    }),
    magnetPen: makeContainerWithFlexibleWalls({
      innerWidth: 9.5,
      innerDepth: 9.5,
      outerHeight: 50,
    }),
    exactoKnife: makeContainerWithFlexibleWalls({
      innerWidth: 12,
      innerDepth: 12,
      outerHeight: 50,
    }),
    files: makeContainerWithFlexibleWalls({
      innerWidth: 90,
      innerDepth: 5,
      outerHeight: 60,
      minBottomHoleSideLength: 1,
      bottomClearance: 16,
      xClearance: 16,
      baseClearance: 20,
    }),
    calipers: makeContainerWithFlexibleDimensions({
      innerWidth: 92,
      innerDepth: 30,
      outerHeight: 120,
      baseClearance: 16,
      xClearance: 16,
      yClearance: 10,
      bottomClearance: 10,
    }),
    level: makeContainerWithFlexibleDimensions({
      innerWidth: 42,
      innerDepth: 17,
      outerHeight: 100,
      xClearance: 16,
      yClearance: 8,
      baseClearance: 16,
    }),
    lighter: makeContainerWithFlexibleDimensions({
      innerWidth: 26,
      innerDepth: 15,
      outerHeight: 50,
      bottomClearance: 8,
      xClearance: 10,
      baseClearance: 10,
    }),
    rulers: makeContainerWithFlexibleDimensions({
      innerWidth: 30.1,
      innerDepth: 5,
      outerHeight: 100,
      minBottomHoleSideLength: 1,
      bottomClearance: 5,
    }),
    superLube: makeContainerWithFlexibleDimensions({
      innerWidth: 43,
      innerDepth: 43,
      outerHeight: 40,
      xClearance: 16,
      yClearance: 16,
      baseClearance: 16,
      bottomClearance: 8,
    }),
    prusaLube: makeContainerWithFlexibleDimensions({
      innerWidth: 15,
      innerDepth: 15,
      outerHeight: 50,
    }),
    laserThermometer: makeContainerWithFlexibleWalls({
      innerWidth: 91,
      innerDepth: 40,
      outerHeight: 80,
      xClearance: 16,
      yClearance: 16,
      baseClearance: 16,
      bottomClearance: 16,
    }),
    powerDrill: makeContainerWithFlexibleDimensions({
      innerWidth: 133,
      innerDepth: 73,
      outerHeight: 20,
    }),
  };

  const {
    entity,
  } = metaMap.powerDrill;

  return entity;
};
