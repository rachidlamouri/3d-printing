const _ = require('lodash');
const { makeContainer } = require('../lib/makeContainer');

const { miniCard } = require('./lotrConstants');
const {
  sizeToMeta,
  assembleMeta,
} = require('../lib/utils');

const createBlock = ({
  stepHeight,
  baseHeight,
  numberOfCards,
  widthOffset,
}) => {
  const size = [
    miniCard.width + (widthOffset * (numberOfCards - 1)),
    miniCard.depth,
    baseHeight + numberOfCards * stepHeight,
  ];

  return {
    block: {
      ...sizeToMeta(size),
      cube: cube({ size }),
    },
  };
};

const createCards = ({
  baseHeight,
  numberOfCards,
  block,
  stepHeight,
  widthOffset,
  wallThickness,
}) => {
  const cardHoles = _.range(numberOfCards).map((index) => {
    const size = [
      miniCard.width,
      miniCard.depth,
      block.height,
    ];

    return cube({ size })
      .translate([
        wallThickness + widthOffset * index,
        wallThickness,
        baseHeight + index * stepHeight,
      ])
      .setColor([0, 0, 1]);
  });

  return {
    cardHoles,
  };
};

const createOuterContainer = ({
  block,
  stepHeight,
  wallThickness,
}) => {
  const outerContainer = makeContainer({
    innerWidth: block.width,
    innerDepth: block.depth,
    outerHeight: Math.ceil(block.height + stepHeight),
    ignoreDecimalPrecision: true,
    bottomClearance: 0,
    wallThickness,
  });

  return {
    outerContainer,
  };
};

const createEntity = ({
  block,
  cardHoles,
  outerContainer,
}) => {
  const entity = union(
    difference(
      block.cube,
      ...cardHoles,
    ),
    outerContainer.container,
  );

  return {
    entity,
  };
};

module.exports.makeDamageContainer = ({
  numberOfCards = 2,
  baseHeight = 0.6,
}) => {
  const initialParameters = {
    baseHeight,
    stepHeight: 0.6,
    widthOffset: 16,
    numberOfCards,
    wallThickness: 0.8,
  };

  return assembleMeta(
    initialParameters,
    createBlock,
    createCards,
    createOuterContainer,
    createEntity,
  );
};
