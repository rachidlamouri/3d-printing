const Joi = require('@hapi/joi');
const { validateParameters } = require('./validation');
const { makeContainer } = require('./makeContainer');

module.exports.makeBoxAndLid = ({
  innerWidth = 20,
  innerDepth = 20,
  innerHeight = 19.2,
  bottomAndTopThickness = 0.3,
  lidAllowance = 0.1,
}) => {
  const wallThickness = 1;

  const parameters = { lidAllowance };

  validateParameters(parameters, {}, {
    lidAllowance: () => Joi.number().precision(1).required(),
  });

  const boxOuterHeight = innerHeight + bottomAndTopThickness;
  const box = makeContainer({
    innerWidth,
    innerDepth,
    outerHeight: boxOuterHeight,
    wallThickness,
    bottomThickness: bottomAndTopThickness,
    minBottomHoleSideLength: 0,
    bottomClearance: Infinity,
  });

  const lid = makeContainer({
    innerWidth: box.finalDimensions.width + 2 * lidAllowance,
    innerDepth: box.finalDimensions.depth + 2 * lidAllowance,
    outerHeight: boxOuterHeight + 2 * lidAllowance,
    wallThickness,
    bottomThickness: bottomAndTopThickness,
    minBottomHoleSideLength: 0,
    bottomClearance: Infinity,
  });

  return {
    parameters,
    box,
    lid,
  };
};
