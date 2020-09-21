const {
  primitives3d: { cube },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const _ = require('lodash');
const { makeContainer } = require('../lib/makeContainer');

const { miniCard } = require('./lotrConstants');
const {
  sizeToMeta,
  positionToMeta,
  assembleMeta,
} = require('../lib/utils');

const createBlock = ({
  stepHeight,
  baseHeight,
  numberOfCards,
  widthOffset,
  wallThickness,
}) => {
  const size = [
    miniCard.width + (widthOffset * (numberOfCards - 1)),
    miniCard.depth,
    baseHeight + numberOfCards * stepHeight,
  ];

  const position = [
    wallThickness,
    wallThickness,
    0,
  ];

  return {
    blockMeta: {
      ...sizeToMeta(size),
      ...positionToMeta(position),
      cube: cube({ size })
        .translate(position),
    },
  };
};

const createCardHoles = ({
  baseHeight,
  numberOfCards,
  blockMeta,
  stepHeight,
  widthOffset,
}) => {
  const cardHoles = _.range(numberOfCards).map((index) => {
    const size = [
      miniCard.width,
      miniCard.depth,
      blockMeta.height,
    ];

    return cube({ size })
      .translate([
        widthOffset * index,
        0,
        baseHeight + index * stepHeight,
      ])
      .setColor([0, 0, 1]);
  });

  return {
    unionedCardHoles: union(...cardHoles).translate(blockMeta.position),
  };
};

const createOuterContainer = ({
  blockMeta,
  stepHeight,
  wallThickness,
}) => {
  const outerContainerMeta = makeContainer({
    innerWidth: blockMeta.width,
    innerDepth: blockMeta.depth,
    outerHeight: Math.ceil(blockMeta.height + stepHeight),
    ignoreDecimalPrecision: true,
    bottomClearance: 0,
    wallThickness,
  });

  return {
    outerContainerMeta,
    finalDimensions: outerContainerMeta.finalDimensions,
  };
};

const createWallHole = ({
  outerContainerMeta,
  wallThickness,
}) => {
  const overhang = 2;
  const size = [
    outerContainerMeta.innerWidth,
    wallThickness + overhang,
    outerContainerMeta.outerHeight,
  ];

  const position = [
    wallThickness,
    0,
    0,
  ];

  return {
    wallHoleMeta: {
      ...sizeToMeta(size),
      ...positionToMeta(position),
      entity: cube(size)
        .translate(position),
    },
    overhang,
  };
};

const createBottomThicknessHoles = ({
  outerContainerMeta,
  baseHeight,
  plateHoleTolerance,
}) => {
  const sideLength = miniCard.width / 4;
  const edgeOffset = 16;
  const plateCutoutSideLength = sideLength - plateHoleTolerance;

  const centerPositions = [
    [edgeOffset + (sideLength / 2), edgeOffset + (sideLength / 2)],
    [edgeOffset + (sideLength / 2), outerContainerMeta.finalDimensions.depth - edgeOffset - (sideLength / 2)],
    [outerContainerMeta.finalDimensions.width - edgeOffset - (sideLength / 2), edgeOffset + (sideLength / 2)],
    [outerContainerMeta.finalDimensions.width - edgeOffset - (sideLength / 2), outerContainerMeta.finalDimensions.depth - edgeOffset - (sideLength / 2)],
  ];

  const bottomThicknessHoleMetas = {
    regularEntities: centerPositions.map(([widthCenterOffset, depthCenterOffset]) => (
      cube([
        sideLength,
        sideLength,
        baseHeight,
      ])
        .translate([
          widthCenterOffset - (sideLength / 2),
          depthCenterOffset - (sideLength / 2),
        ])
        .setColor([0, 0, 1])
    )),
    plateHoleEntities: centerPositions.map(([widthCenterOffset, depthCenterOffset]) => (
      cube([
        plateCutoutSideLength,
        plateCutoutSideLength,
        baseHeight,
      ])
        .translate([
          widthCenterOffset - (plateCutoutSideLength / 2),
          depthCenterOffset - (plateCutoutSideLength / 2),
        ])
        .setColor([0, 0, 1])
    )),
  };

  return {
    bottomThicknessHoleMetas,
  };
};

const createEntity = ({
  blockMeta,
  unionedCardHoles,
  outerContainerMeta,
  wallHoleMeta,
  bottomThicknessHoleMetas,
}) => {
  const entity = difference(
    union(
      difference(
        blockMeta.cube,
        unionedCardHoles,
      ),
      outerContainerMeta.container,
    ),
    wallHoleMeta.entity,
    ...bottomThicknessHoleMetas.regularEntities,
  );

  return {
    entity,
    plateHoleEntity: difference(
      cube(outerContainerMeta.finalDimensions.size),
      ...bottomThicknessHoleMetas.plateHoleEntities,
    ),
  };
};

module.exports.makeDamageContainer = ({
  numberOfCards = 2,
  baseHeight,
  plateHoleTolerance,
}) => {
  const initialParameters = {
    baseHeight,
    stepHeight: 0.6,
    widthOffset: 16,
    numberOfCards,
    wallThickness: 0.8,
    plateHoleTolerance,
  };

  return assembleMeta(
    initialParameters,
    createBlock,
    createCardHoles,
    createOuterContainer,
    createWallHole,
    createBottomThicknessHoles,
    createEntity,
  );
};
