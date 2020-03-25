const Joi = require('@hapi/joi');
const _ = require('lodash');
const {
  requiredPositiveInteger,
  requiredBoolean,
  validateParameters,
} = require('./validation');
const {
  sizeToMeta,
  assembleMeta,
  buildBuildWithDefaults,
} = require('./utils');
const { makeContainer } = require('./makeContainer');

const createRepeatedEntities = ({
  innerWidth,
  innerDepth,
  outerHeight,
  dividerThickness,
  bottomThickness,
  minBottomHoleSideLength,
  bottomClearance,
  count,
}) => {
  const repeatedEntities = _.range(count).map((index) => {
    const containerMeta = makeContainer({
      innerWidth,
      innerDepth,
      outerHeight,
      sideLengthMultiple: null,
      wallThickness: dividerThickness,
      bottomThickness,
      minBottomHoleSideLength,
      bottomClearance,
    });

    const { outerWidth } = containerMeta;
    const xOffset = (
      index === 0
        ? 0
        : (index * outerWidth) - (index * dividerThickness)
    );

    containerMeta.container = containerMeta.container.translate([xOffset, 0, 0]);
    const repeatedEntity = {
      containerMeta,
      xOffset,
    };
    return repeatedEntity;
  });

  return {
    repeatedEntities,
  };
};

const calculateStartingOuterSize = ({
  repeatedEntities,
}) => {
  const lastRepeatedEntity = _.last(repeatedEntities);
  const { xOffset, containerMeta: { outerWidth, outerDepth, outerHeight } } = lastRepeatedEntity;
  const startingOuterSize = [xOffset + outerWidth, outerDepth, outerHeight];

  return {
    startingOuterSize,
  };
};

const createOuterContainerMeta = ({
  sideLengthMultiple,
  startingOuterSize,
  isSideLengthMultipleSet,
}) => {
  const [innerWidth, innerDepth, outerHeight] = startingOuterSize;

  let outerContainerMeta = null;
  if (isSideLengthMultipleSet) {
    outerContainerMeta = makeContainer({
      innerWidth,
      innerDepth,
      outerHeight,
      minWallThickness: 0.1,
      bottomClearance: 0,
      sideLengthMultiple,
      ignoreDecimalPrecision: true,
    });

    outerContainerMeta.container = outerContainerMeta.container.setColor([0, 0, 1]);
  }

  return {
    outerContainerMeta,
    finalDimensions: sizeToMeta(
      isSideLengthMultipleSet
        ? outerContainerMeta.outerBox.size
        : startingOuterSize,
    ),
  };
};

const createEntity = ({
  isSideLengthMultipleSet,
  repeatedEntities,
  outerContainerMeta,
}) => {
  const unionedRepeatedContainers = union(
    ...repeatedEntities.map((repeatedEntity) => repeatedEntity.containerMeta.container),
  );

  const container = (
    isSideLengthMultipleSet
      ? union(
        unionedRepeatedContainers
          .translate([outerContainerMeta.widthWallThickness, outerContainerMeta.depthWallThickness, 0]),
        outerContainerMeta.container,
      )
      : unionedRepeatedContainers
  );

  return {
    container,
    entity: container,
  };
};

const createDebug = ({
  isSideLengthMultipleSet,
  startingOuterSize,
  outerContainerMeta,
}) => {
  const finalOuterSize = (
    isSideLengthMultipleSet
      ? outerContainerMeta.outerBox.size
      : startingOuterSize
  );

  return {
    debug: {
      startingOuterSize,
      finalOuterSize,
    },
  };
};
const makeRepeatContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  count = 2,
  sideLengthMultiple = null,
  dividerThickness = 1,
  bottomThickness = 1,
  minBottomHoleSideLength,
  bottomClearance = 16,
  ...extraParameters
} = {}) => {
  const parameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    dividerThickness,
    bottomThickness,
    minBottomHoleSideLength,
    bottomClearance,
    count,
    sideLengthMultiple,
    isSideLengthMultipleSet: sideLengthMultiple !== null,
  };

  validateParameters(parameters, extraParameters, {
    innerWidth: Joi.any(),
    innerDepth: Joi.any(),
    outerHeight: Joi.any(),
    dividerThickness: Joi.any(),
    bottomThickness: Joi.any(),
    minBottomHoleSideLength: Joi.any(),
    bottomClearance: Joi.any(),
    count: requiredPositiveInteger(),
    sideLengthMultiple: requiredPositiveInteger().allow(null),
    isSideLengthMultipleSet: requiredBoolean(),
  });

  return assembleMeta(
    parameters,
    createRepeatedEntities,
    calculateStartingOuterSize,
    createOuterContainerMeta,
    createEntity,
    createDebug,
  );
};

module.exports = {
  makeRepeatContainer,
  buildMakeRepeatContainerWithDefaults: buildBuildWithDefaults(makeRepeatContainer),
};
