const _ = require('lodash');

const sizeToMeta = (size) => {
  const [width, depth, height] = size;
  return {
    size,
    width,
    depth,
    height,
  };
};
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

const calculateDimensions = ({
  innerWidth,
  innerDepth,
  outerHeight,
  sideLengthMultiple,
  minWallThickness,
  bottomThickness,
  minBottomHoleSideLength,
  bottomClearance,
}) => {
  const minOuterWidth = innerWidth + 2 * minWallThickness;
  const minOuterDepth = innerDepth + 2 * minWallThickness;
  const outerWidth = getNextMultiple(minOuterWidth, sideLengthMultiple);
  const outerDepth = getNextMultiple(minOuterDepth, sideLengthMultiple);

  return {
    innerHeight: outerHeight - bottomThickness,
    outerWidth,
    outerDepth,
    widthWallThickness: (outerWidth - innerWidth) / 2,
    depthWallThickness: (outerDepth - innerDepth) / 2,
    bottomHoleWidth: Math.max(
      innerWidth - 2 * bottomClearance,
      minBottomHoleSideLength,
    ),
    bottomHoleDepth: Math.max(
      innerDepth - 2 * bottomClearance,
      minBottomHoleSideLength,
    ),
  };
};

const createOuterBox = ({
  outerWidth,
  outerDepth,
  outerHeight,
}) => {
  const size = [
    outerWidth,
    outerDepth,
    outerHeight,
  ];

  return {
    outerBox: {
      ...sizeToMeta(size),
      cube: cube({ size }),
    },
  };
};

const createInnerBox = ({
  innerWidth,
  innerDepth,
  innerHeight,
  widthWallThickness,
  depthWallThickness,
  bottomThickness,
}) => {
  const size = [
    innerWidth,
    innerDepth,
    innerHeight,
  ];
  const position = [
    widthWallThickness,
    depthWallThickness,
    bottomThickness,
  ];

  return {
    innerBox: {
      ...sizeToMeta(size),
      cube: cube({ size }).translate(position),
    },
  };
};

const createBottomHole = ({
  outerWidth,
  outerDepth,
  bottomHoleWidth,
  bottomHoleDepth,
  bottomThickness,
}) => {
  const size = [
    bottomHoleWidth,
    bottomHoleDepth,
    bottomThickness,
  ];
  const position = [
    outerWidth / 2 - bottomHoleWidth / 2,
    outerDepth / 2 - bottomHoleDepth / 2,
    0,
  ];

  return {
    bottomHole: {
      ...sizeToMeta(size),
      cube: cube({ size }).translate(position),
    },
  };
};

const createContainer = ({
  outerBox,
  innerBox,
  bottomHole,
}) => {
  const differenceList = [
    outerBox.cube,
    innerBox.cube,
  ];

  if (bottomHole.width > 0 && bottomHole.depth > 0) {
    differenceList.push(bottomHole.cube);
  }

  return {
    container: difference(...differenceList),
  };
};

const createDebug = ({
  innerBox,
  outerBox,
  bottomHole,
  widthWallThickness,
  depthWallThickness,
  bottomThickness,
}) => ({
  debug: {
    innerBoxSize: innerBox.size,
    outerBoxSize: outerBox.size,
    wallThicknessSizes: [
      widthWallThickness,
      depthWallThickness,
      bottomThickness,
    ],
    bottomHoleSize: bottomHole.size,
  },
});

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
  const parameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    sideLengthMultiple,
    minWallThickness,
    bottomThickness,
    minBottomHoleSideLength,
    bottomClearance,
  };
  validateParameters(parameters, extraParameters);

  return [
    calculateDimensions,
    createOuterBox,
    createInnerBox,
    createBottomHole,
    createContainer,
    createDebug,
  ].reduce(
    (meta, assembler) => ({
      ...meta,
      ...assembler(meta),
    }),
    parameters,
  );
};
