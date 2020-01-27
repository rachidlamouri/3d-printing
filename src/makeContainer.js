const _ = require('lodash');

const getNextMultiple = (value, multiplier) => Math.ceil(value / multiplier) * multiplier;

const validateParameters = (parameters, extraParameters) => {
  if (!_.isEmpty(extraParameters)) {
    throw new Error(`Unexpected extra parameter(s) [${_.keys(extraParameters).join(',')}]`);
  }

  const isIntegerRule = [_.isInteger, 'must be an integer'];
  const isPositiveRule = [(value) => value > 0, 'must be greater than zero'];
  const isNonNegativeRule = [(value) => value >= 0, 'must be greater than or equal to zero'];

  const isPositiveRuleSet = [isPositiveRule];
  const isPositiveIntegerRuleSet = [
    isIntegerRule,
    isPositiveRule,
  ];
  const isNonNegativeIntegerRuleSet = [
    isIntegerRule,
    isNonNegativeRule,
  ];

  const keyedRuleSets = {
    innerWidth: isPositiveIntegerRuleSet,
    innerDepth: isPositiveIntegerRuleSet,
    outerHeight: isPositiveIntegerRuleSet,
    sideLengthMultiple: isPositiveIntegerRuleSet,
    minWallThickness: isPositiveRuleSet,
    bottomThickness: isPositiveRuleSet,
    minBottomHoleSideLength: isNonNegativeIntegerRuleSet,
    bottomClearance: [
      [(value) => _.isInteger(value) || value === Infinity, 'must be an integer or positive infinity'],
      isPositiveRule,
    ],
  };

  _.forEach(keyedRuleSets, (ruleSet, parameterName) => {
    ruleSet.forEach(([test, rule]) => {
      if (!test(parameters[parameterName])) {
        throw new Error(`${parameterName} ${rule}`);
      }
    });
  });
};

module.exports.makeContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  sideLengthMultiple = 2,
  minWallThickness = 2,
  bottomThickness = 1,
  minBottomHoleSideLength = 5,
  bottomClearance = 16,
  ...extraParameters
} = {}) => {
  validateParameters(
    {
      innerWidth,
      innerDepth,
      outerHeight,
      sideLengthMultiple,
      minWallThickness,
      bottomThickness,
      minBottomHoleSideLength,
      bottomClearance,
    },
    extraParameters,
  );

  const innerHeight = outerHeight - bottomThickness;

  const minOuterWidth = innerWidth + 2 * minWallThickness;
  const minOuterDepth = innerDepth + 2 * minWallThickness;
  const outerWidth = getNextMultiple(minOuterWidth, sideLengthMultiple);
  const outerDepth = getNextMultiple(minOuterDepth, sideLengthMultiple);

  const widthWallThickness = (outerWidth - innerWidth) / 2;
  const depthWallThickness = (outerDepth - innerDepth) / 2;

  const bottomHoleWidth = Math.max(
    innerWidth - 2 * bottomClearance,
    minBottomHoleSideLength,
  );
  const bottomHoleDepth = Math.max(
    innerDepth - 2 * bottomClearance,
    minBottomHoleSideLength,
  );

  const outerBoxSize = [
    outerWidth,
    outerDepth,
    outerHeight,
  ];
  const outerBox = cube({ size: outerBoxSize });

  const innerBoxSize = [
    innerWidth,
    innerDepth,
    innerHeight,
  ];
  const innerBoxPosition = [
    widthWallThickness,
    depthWallThickness,
    bottomThickness,
  ];
  const innerBox = cube({ size: innerBoxSize })
    .translate(innerBoxPosition);

  const bottomHoleSize = [
    bottomHoleWidth,
    bottomHoleDepth,
    bottomThickness,
  ];
  const bottomHolePosition = [
    outerWidth / 2 - bottomHoleWidth / 2,
    outerDepth / 2 - bottomHoleDepth / 2,
    0,
  ];
  const bottomHoleBox = cube({ size: bottomHoleSize })
    .translate(bottomHolePosition);

  const differenceList = [
    outerBox,
    innerBox,
  ];

  if (bottomHoleWidth > 0 && bottomHoleDepth > 0) {
    differenceList.push(bottomHoleBox);
  }

  const container = difference(...differenceList);

  const containerMeta = {
    container,
    innerBoxSize,
    outerBoxSize,
    wallThicknessSize: [
      widthWallThickness,
      depthWallThickness,
      bottomThickness,
    ],
    bottomHoleSize,
  };

  return containerMeta;
};
