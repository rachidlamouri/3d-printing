const {
  sizeToMeta,
  getNextMultiple,
  assembleMeta,
} = require('../../lib/utils');

const deriveDimensions = ({
  outerHeight,
  corkHeight,
  corkSideLength,
  brimTolerance,
  minBrimThickness,
  sideLengthMultiple,
}) => {
  const startingOuterWidth = corkSideLength + brimTolerance + minBrimThickness;
  const outerWidth = getNextMultiple(startingOuterWidth, sideLengthMultiple);
  const brimThickness = outerWidth - brimTolerance - corkSideLength;
  const brimHeight = outerHeight - corkHeight;

  return {
    outerWidth,
    brimThickness,
    brimHeight,
  };
};

const createTop = ({
  outerWidth,
  outerHeight,
  brimHeight,
}) => {
  const size = [
    outerWidth,
    outerWidth,
    outerHeight - brimHeight,
  ];

  return {
    topMeta: {
      ...sizeToMeta(size),
      entity: cube(size).translate([0, 0, brimHeight]),
    },
  };
};

const createBrim = ({
  outerWidth,
  brimHeight,
  brimThickness,
}) => {
  const outerDimensions = sizeToMeta([
    outerWidth,
    outerWidth,
    brimHeight,
  ]);

  const innerDimensions = sizeToMeta([
    outerWidth - brimThickness * 2,
    outerWidth - brimThickness * 2,
    brimHeight,
  ]);

  const innerOffset = (outerDimensions.width - innerDimensions.width) / 2;
  return {
    brimMeta: {
      entity: difference(
        cube(outerDimensions.size),
        cube(innerDimensions.size)
          .translate([innerOffset, innerOffset]),
      ),
    },
  };
};

const createEntity = ({
  topMeta,
  brimMeta,
  outerWidth,
}) => {
  const entity = union(
    topMeta.entity,
    brimMeta.entity,
  ).translate([-outerWidth / 2, -outerWidth / 2]);

  return {
    entity,
  };
};

module.exports.makeBaseCoaster = ({
  outerHeight,
  corkHeight,
  exposedCorkHeight,
  corkSideLength,
  brimTolerance,
  minBrimThickness,
  sideLengthMultiple,
}) => assembleMeta(
  {
    outerHeight,
    corkHeight,
    exposedCorkHeight,
    corkSideLength,
    brimTolerance,
    minBrimThickness,
    sideLengthMultiple,
  },
  deriveDimensions,
  createTop,
  createBrim,
  createEntity,
);
