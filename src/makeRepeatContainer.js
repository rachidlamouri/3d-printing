const Joi = require('@hapi/joi');
const _ = require('lodash');
const {
  requiredPositiveInteger,
  validateParameters,
} = require('./lib/validation');
const {
  assembleMeta,
} = require('./lib/utils');
const { makeContainer } = require('./makeContainer');

const createContainers = ({
  innerWidth,
  innerDepth,
  outerHeight,
  count,
}) => {
  const wallThickness = 1;
  let startingOuterSize;

  const repeatedContainer = union(
    ..._.range(count).map((index) => {
      const {
        container,
        outerWidth,
        outerDepth,
      } = makeContainer({
        innerWidth,
        innerDepth,
        outerHeight,
        sideLengthMultiple: null,
        wallThickness,
      });

      const xOffset = (
        index === 0
          ? 0
          : (index * outerWidth) - (index * wallThickness)
      );
      startingOuterSize = [xOffset + outerWidth, outerDepth, outerHeight];

      return container.translate([xOffset, 0, 0]);
    }),
  );

  return {
    startingOuterSize,
    container: repeatedContainer,
  };
};

const createDebug = ({
  startingOuterSize,
}) => ({
  debug: {
    startingOuterSize,
  },
});

module.exports.makeRepeatContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  count = 2,
  ...extraParameters
} = {}) => {
  const parameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    count,
  };

  validateParameters(parameters, extraParameters, {
    innerWidth: Joi.any(),
    innerDepth: Joi.any(),
    outerHeight: Joi.any(),
    count: requiredPositiveInteger(),
  });

  return assembleMeta(
    parameters,
    createContainers,
    createDebug,
  );
};
