const _ = require('lodash');
const {
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

  const repeatedContainer = union(
    ..._.range(count).map((index) => {
      const { container, outerWidth } = makeContainer({
        innerWidth,
        innerDepth,
        outerHeight,
        sideLengthMultiple: 1,
        wallThickness,
      });

      const xOffset = (index * outerWidth) - ((index - 1) * wallThickness);
      return container.translate([xOffset, 0, 0]);
    }),
  );

  return {
    container: repeatedContainer,
  };
};

const createDebug = () => ({
  debug: {},
});

module.exports.makeRepeatContainer = ({
  innerWidth,
  innerDepth,
  outerHeight,
  count = 2,
  ...extraParameters
} = {}) => {
  const parameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    count,
  };

  validateParameters(parameters, extraParameters);

  return assembleMeta(
    parameters,
    createContainers,
    createDebug,
  );
};
