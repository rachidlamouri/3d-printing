const {
  booleanOps: { union },
} = require('@jscad/csg/api');
const Joi = require('@hapi/joi');
const { validateParameters } = require('./validation');
const { makeContainer } = require('./makeContainer');
const {
  center,
  buildBuildWithDefaults,
} = require('../lib/utils');

module.exports.makeBoxAndLid = ({
  innerWidth = 20,
  innerDepth = 20,
  innerHeight = 19.2,
  bottomAndTopThickness = 0.2,
  wallThickness = 0.8,
  lidAllowance = 0.1,
  lidHeightPercentage = 1,
  ...extraParameters
} = {}) => {
  const parameters = { lidAllowance };

  validateParameters(parameters, extraParameters, {
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
    ignoreDecimalPrecision: true,
  });

  const lid = makeContainer({
    innerWidth: box.finalDimensions.width + 2 * lidAllowance,
    innerDepth: box.finalDimensions.depth + 2 * lidAllowance,
    outerHeight: (lidHeightPercentage * boxOuterHeight) + 2 * lidAllowance,
    wallThickness,
    bottomThickness: bottomAndTopThickness,
    minBottomHoleSideLength: 0,
    bottomClearance: Infinity,
    ignoreDecimalPrecision: true,
  });

  return {
    parameters,
    box,
    lid,
    sideBySide: union(
      box.csg.center(center),
      lid.csg.center(center).translate([lid.finalDimensions.width, 0]),
    ),
    frontToBack: union(
      box.csg.center(center),
      lid.csg.center(center).translate([0, lid.finalDimensions.depth]),
    ),
  };
};

module.exports.buildMakeBoxAndLidWithDefaults = buildBuildWithDefaults(module.exports.makeBoxAndLid);
