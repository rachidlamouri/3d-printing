const _ = require('lodash');
const { makeRepeatContainer } = require('../lib/makeRepeatContainer');
const { miniCard } = require('./lotrConstants');
const {
  sizeToMeta,
  positionToMeta,
  assembleMeta,
} = require('../lib/utils');

const createBaseContainer = ({
  numberOfCards,
  outerHeight,
  dividerThickness,
  bottomThickness,
  bottomClearance,
}) => {
  const baseContainerMeta = makeRepeatContainer({
    count: numberOfCards,
    innerWidth: miniCard.width,
    innerDepth: miniCard.depth,
    outerHeight,
    dividerThickness,
    bottomClearance,
    bottomThickness,
  });

  return {
    baseContainerMeta,
    finalDimensions: baseContainerMeta.finalDimensions,
  };
};

const createThumbHoles = ({
  baseContainerMeta,
  dividerThickness,
  bottomThickness,
  thumbHoleWidth,
  bottomClearance,
}) => {
  const wallHoleMetas = baseContainerMeta.repeatedEntities.map(({ xOffset, containerMeta }) => {
    const size = [
      containerMeta.innerWidth,
      dividerThickness,
      containerMeta.outerHeight,
    ];

    const position = [
      dividerThickness + xOffset,
      0,
      bottomThickness,
    ];

    return {
      ...sizeToMeta(size),
      ...positionToMeta(position),
      entity: cube({ size })
        .translate(position),
    };
  });

  const thumbHoleMetas = wallHoleMetas.map((wallHoleMeta) => {
    const size = [
      thumbHoleWidth,
      bottomClearance / 2,
      bottomThickness,
    ];

    const position = [
      wallHoleMeta.x + (wallHoleMeta.width / 2) - (thumbHoleWidth / 2),
      0,
      0,
    ];

    return {
      ...sizeToMeta(size),
      ...positionToMeta(position),
      entity: cube({ size })
        .translate(position),
    };
  });

  return {
    wallHoleMetas,
    thumbHoleMetas,
  };
};

const createEntity = ({
  baseContainerMeta,
  wallHoleMetas,
  thumbHoleMetas,
}) => {
  const entity = difference(
    baseContainerMeta.container,
    ..._.map(wallHoleMetas, 'entity'),
    ..._.map(thumbHoleMetas, 'entity'),
  );

  return {
    entity,
  };
};

module.exports.makeCardBank = ({
  numberOfCards = 2,
  outerHeight,
  dividerThickness,
  bottomThickness = 0.6,
}) => {
  const initialParameters = {
    numberOfCards,
    outerHeight,
    dividerThickness,
    bottomThickness,
    bottomClearance: 5,
    thumbHoleWidth: 20,
  };

  return assembleMeta(
    initialParameters,
    createBaseContainer,
    createThumbHoles,
    createEntity,
  );
};
