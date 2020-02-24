const { makeContainer } = require('../lib/makeContainer');

const {
  sizeToMeta,
  positionToMeta,
  assembleMeta,
} = require('../lib/utils');

const createBaseContainer = ({
  innerWidth,
  innerDepth,
  outerHeight,
  bottomThickness,
  bottomClearance,
  wallThickness,
  plateHoleTolerance,
}) => {
  const baseContainerMeta = makeContainer({
    innerWidth,
    innerDepth,
    outerHeight,
    bottomThickness,
    bottomClearance,
    wallThickness,
  });

  return {
    baseContainerMeta,
    plateHoleMeta: makeContainer({
      ...baseContainerMeta.initialParameters,
      bottomClearance: bottomClearance + plateHoleTolerance,
    }),
  };
};

const createThumbHole = ({
  baseContainerMeta,
  thumbHoleWidth,
  bottomClearance,
}) => {
  const size = [
    thumbHoleWidth,
    bottomClearance / 2,
    baseContainerMeta.finalDimensions.height,
  ];

  const position = [
    (baseContainerMeta.finalDimensions.width / 2) - (thumbHoleWidth / 2),
    0,
  ];

  return {
    thumbHoleMeta: {
      ...sizeToMeta(size),
      ...positionToMeta(position),
      entity: cube(size).translate(position),
    },
  };
};

const createEntity = ({
  baseContainerMeta,
  thumbHoleMeta,
}) => {
  const entity = difference(
    baseContainerMeta.entity,
    thumbHoleMeta.entity,
  );

  return {
    entity,
    finalDimensions: baseContainerMeta.finalDimensions,
  };
};

module.exports.makePlayerCard = ({
  innerWidth,
  innerDepth,
  outerHeight,
  bottomThickness,
  bottomClearance,
  plateHoleTolerance,
  wallThickness,
}) => {
  const initialParameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    bottomThickness,
    bottomClearance,
    plateHoleTolerance,
    wallThickness,
    thumbHoleWidth: 40,
  };

  return assembleMeta(
    initialParameters,
    createBaseContainer,
    createThumbHole,
    createEntity,
  );
};
