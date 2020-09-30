const Joi = require('@hapi/joi');
const { validateParameters } = require('./validation');
const { makeContainer } = require('./makeContainer');

module.exports.makeBoxAndLid = ({
  innerWidth = 20,
  innerDepth = 20,
  innerHeight = 19.2,
  bottomAndTopThickness = 0.2,
  wallThickness = 0.8,
  lidAllowance = 0.1,
  lidHeightPercentage = 1,
}) => {
  const parameters = { lidAllowance };

  validateParameters(parameters, {}, {
    lidAllowance: () => Joi.number().precision(1).required(),
    lidHeightPercentage: () => (
      Joi.number()
        .precision(1)
        .min(0.01)
        .max(1)
        .required()
    ),
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
    outerHeight: (lidHeightPercentage * boxOuterHeight) + 2 * lidAllowance,
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
