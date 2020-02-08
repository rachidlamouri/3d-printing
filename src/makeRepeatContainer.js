const Joi = require('@hapi/joi');
const _ = require('lodash');
const {
  requiredPositiveInteger,
  requiredBoolean,
  validateParameters,
} = require('./lib/validation');
const {
  assembleMeta,
} = require('./lib/utils');
const { makeContainer } = require('./makeContainer');

const createRepeatedEntities = ({
  innerWidth,
  innerDepth,
  outerHeight,
  count,
}) => {
  const wallThickness = 1;
  const repeatedEntities = _.range(count).map((index) => {
    const containerMeta = makeContainer({
      innerWidth,
      innerDepth,
      outerHeight,
      sideLengthMultiple: null,
      wallThickness,
    });

    const { outerWidth } = containerMeta;
    const xOffset = (
      index === 0
        ? 0
        : (index * outerWidth) - (index * wallThickness)
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
      minWallThickness: 1,
      bottomClearance: 0,
      sideLengthMultiple,
      ignoreDecimalPrecision: true,
    });

    const { widthWallThickness, depthWallThickness } = outerContainerMeta;
    outerContainerMeta.container = outerContainerMeta.container.translate([-widthWallThickness, -depthWallThickness, 0]);
  }

  return {
    outerContainerMeta,
  };
};

const createContainer = ({
  isSideLengthMultipleSet,
  repeatedEntities,
  outerContainerMeta,
}) => {
  const unionedRepeatedContainers = union(
    ...repeatedEntities.map((repeatedEntity) => repeatedEntity.containerMeta.container),
  );

  const container = (
    isSideLengthMultipleSet
      ? union(unionedRepeatedContainers, outerContainerMeta.container)
      : unionedRepeatedContainers
  );

  return {
    container,
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

module.exports.makeRepeatContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  count = 2,
  sideLengthMultiple = null,
  ...extraParameters
} = {}) => {
  const parameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    count,
    sideLengthMultiple,
    isSideLengthMultipleSet: sideLengthMultiple !== null,
  };

  validateParameters(parameters, extraParameters, {
    innerWidth: Joi.any(),
    innerDepth: Joi.any(),
    outerHeight: Joi.any(),
    count: requiredPositiveInteger(),
    sideLengthMultiple: requiredPositiveInteger().allow(null),
    isSideLengthMultipleSet: requiredBoolean(),
  });

  return assembleMeta(
    parameters,
    createRepeatedEntities,
    calculateStartingOuterSize,
    createOuterContainerMeta,
    createContainer,
    createDebug,
  );
};
