const _ = require('lodash');
const {
  sizeToMeta,
  getNextMultiple,
  assembleMeta,
} = require('./lib/utils');
const {
  buildIsGreaterThanN,
  isPositiveRule,
  isPositiveRuleSet,
  isPositiveIntegerRuleSet,
  isNonNegativeIntegerRuleSet,
  validateParameters,
} = require('./lib/validation');

const calculateDimensions = ({
  innerWidth,
  innerDepth,
  outerHeight,
  sideLengthMultiple,
  minWallThickness,
  wallThickness,
  isWallThicknessSet,
  bottomThickness,
  minBottomHoleSideLength,
  bottomClearance,
}) => {
  const wallThicknessToUse = isWallThicknessSet ? wallThickness : minWallThickness;
  const minOuterWidth = innerWidth + 2 * wallThicknessToUse;
  const minOuterDepth = innerDepth + 2 * wallThicknessToUse;
  const outerWidth = getNextMultiple(minOuterWidth, sideLengthMultiple);
  const outerDepth = getNextMultiple(minOuterDepth, sideLengthMultiple);

  const adjustedInnerWidth = isWallThicknessSet ? outerWidth - 2 * wallThickness : innerWidth;
  const adjustedInnerDepth = isWallThicknessSet ? outerDepth - 2 * wallThickness : innerDepth;

  return {
    innerWidth: adjustedInnerWidth,
    innerDepth: adjustedInnerDepth,
    innerHeight: outerHeight - bottomThickness,
    outerWidth,
    outerDepth,
    widthWallThickness: (outerWidth - adjustedInnerWidth) / 2,
    depthWallThickness: (outerDepth - adjustedInnerDepth) / 2,
    bottomHoleWidth: Math.max(
      adjustedInnerWidth - 2 * bottomClearance,
      minBottomHoleSideLength,
    ),
    bottomHoleDepth: Math.max(
      adjustedInnerDepth - 2 * bottomClearance,
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
  minWallThickness = 1,
  wallThickness = null,
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
    wallThickness,
    isWallThicknessSet: wallThickness !== null,
    bottomThickness,
    minBottomHoleSideLength,
    bottomClearance,
  };

  const isValidInnerDimensionRuleSet = [
    ...isPositiveIntegerRuleSet,
    [buildIsGreaterThanN(minBottomHoleSideLength), 'must be greater than minBottomHoleSideLength'],
  ];

  validateParameters(parameters, extraParameters, {
    innerWidth: isValidInnerDimensionRuleSet,
    innerDepth: isValidInnerDimensionRuleSet,
    outerHeight: isPositiveIntegerRuleSet,
    sideLengthMultiple: isPositiveIntegerRuleSet,
    minWallThickness: isPositiveRuleSet,
    bottomThickness: isPositiveRuleSet,
    minBottomHoleSideLength: isNonNegativeIntegerRuleSet,
    bottomClearance: [
      [(value) => _.isInteger(value) || value === Infinity, 'must be an integer or positive infinity'],
      isPositiveRule,
    ],
  });

  return assembleMeta(
    parameters,
    calculateDimensions,
    createOuterBox,
    createInnerBox,
    createBottomHole,
    createContainer,
    createDebug,
  );
};
