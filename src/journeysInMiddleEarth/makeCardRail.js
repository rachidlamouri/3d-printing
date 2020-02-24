const _ = require('lodash');
const { miniCard } = require('./lotrConstants');
const {
  sizeToMeta,
  assembleMeta,
} = require('../lib/utils');

const deriveParameters = ({
  numberOfCards,
  edgeWidth,
  miniCardHoleHeight,
  baseDepth,
  baseHeight,
  cardAngleRadians,
}) => {
  const cardIntersectionPointToBottomOfCardXOffset = baseHeight / Math.tan(cardAngleRadians);
  const intersectedWidth = miniCardHoleHeight / Math.sin(cardAngleRadians);
  const cardDepthOffset = (baseDepth / 2) - cardIntersectionPointToBottomOfCardXOffset + (intersectedWidth / 2);

  return {
    baseWidth: numberOfCards * miniCard.width + 2 * edgeWidth,
    cardDepthOffset,
  };
};

const createBase = ({
  baseWidth,
  baseDepth,
  baseHeight,
}) => {
  const size = [
    baseWidth,
    baseDepth,
    baseHeight,
  ];

  return {
    base: {
      ...sizeToMeta(size),
      cube: cube({ size }),
    },
  };
};

const createVerticalGuide = ({
  baseDepth,
  baseHeight,
}) => {
  const depth = 1;
  const size = [
    2,
    depth,
    baseHeight * 2,
  ];

  return {
    verticalGuide: {
      cube: cube({ size })
        .translate([-1, baseDepth / 2 - depth / 2, 0])
        .setColor([0, 0, 1]),
    },
  };
};

const createCardHole = ({
  numberOfCards,
  edgeWidth,
  cardAngleDegrees,
  miniCardHoleHeight,
  cardDepthOffset,
}) => {
  const size = [
    miniCard.width,
    miniCard.depth,
    miniCardHoleHeight,
  ];

  return {
    cardHoles: _.range(numberOfCards).map((index) => ({
      ...sizeToMeta(size),
      cube: cube({ size })
        .rotateX(cardAngleDegrees)
        .setColor([1, 0, 0])
        .translate([edgeWidth + (index * miniCard.width), cardDepthOffset, 0]),
    })),
  };
};

const createCardBottomCutoff = ({
  grooveHeight,
  cardAngleRadians,
  baseWidth,
  baseDepth,
  baseHeight,
}) => {
  const topOfBaseToBottomOfCutoff = grooveHeight * Math.sin(cardAngleRadians);
  const cutoffHeight = baseHeight - topOfBaseToBottomOfCutoff;

  const size = [
    baseWidth + 2,
    baseDepth,
    cutoffHeight,
  ];

  return {
    cardBottomCutoff: {
      ...sizeToMeta(size),
      cube: cube({ size })
        .setColor([0, 1, 0])
        .translate([-1, 0, 0]),
    },
  };
};

const createBottomThicknessHoles = ({
  baseDepth,
  numberOfCards,
  bottomThickness,
  edgeWidth,
  plateHoleTolerance,
}) => {
  const depthOffset = 1;
  const sideLength = baseDepth - 2 * depthOffset;
  const plateCutOutSideLength = sideLength - plateHoleTolerance;

  const bottomThicknessHoleMetas = _.range(numberOfCards).map((index) => ({
    regularEntity: (
      cube([
        sideLength,
        sideLength,
        bottomThickness,
      ])
        .translate([
          edgeWidth + (miniCard.width / 2) - (sideLength / 2) + index * miniCard.width,
          depthOffset,
        ])
        .setColor([0, 0, 1])
    ),
    plateHoleEntity: (
      cube([
        plateCutOutSideLength,
        plateCutOutSideLength,
        bottomThickness,
      ])
        .translate([
          edgeWidth + (miniCard.width / 2) - (plateCutOutSideLength / 2) + index * miniCard.width,
          (baseDepth - plateCutOutSideLength) / 2,
        ])
        .setColor([0, 0, 1])
    ),
  }));

  return {
    bottomThicknessHoleMetas,
  };
};

const createEntity = ({
  showVerticalGuide,
  base,
  verticalGuide,
  cardHoles,
  cardBottomCutoff,
  bottomThicknessHoleMetas,
}) => {
  const baseEntity = showVerticalGuide
    ? union(base.cube, verticalGuide.cube)
    : base.cube;

  const entity = difference(
    baseEntity,
    ...cardHoles.map((cardHole) => (
      difference(
        cardHole.cube,
        cardBottomCutoff.cube,
      )
    )),
    ..._.map(bottomThicknessHoleMetas, 'regularEntity'),
  );

  const plateHoleEntity = difference(
    baseEntity,
    ..._.map(bottomThicknessHoleMetas, 'plateHoleEntity'),
  );

  return {
    entity,
    plateHoleEntity,
    finalDimensions: sizeToMeta(base.size),
  };
};

module.exports.makeCardRail = ({
  numberOfCards = 1,
  baseHeight = 10,
  bottomThickness = 0.6,
  plateHoleTolerance,
}) => {
  const cardAngleDegrees = 70;
  const initialParameters = {
    numberOfCards,
    showVerticalGuide: false,
    edgeWidth: 0.8,
    cardAngleDegrees,
    cardAngleRadians: (cardAngleDegrees * Math.PI) / 180,
    miniCardHoleHeight: 1,
    grooveHeight: 6.5,
    baseHeight,
    baseDepth: 10,
    bottomThickness,
    plateHoleTolerance,
  };

  return assembleMeta(
    initialParameters,
    deriveParameters,
    createBase,
    createVerticalGuide,
    createCardHole,
    createCardBottomCutoff,
    createBottomThicknessHoles,
    createEntity,
  );
};
