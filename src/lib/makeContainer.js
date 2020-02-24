const Joi = require('@hapi/joi');
const _ = require('lodash');
const {
  sizeToMeta,
  positionToMeta,
  getNextMultiple,
  assembleMeta,
  buildBuildWithDefaults,
} = require('./utils');
const {
  requiredPositiveInteger,
  requiredPositiveNumber,
  requiredNonNegativeInteger,
  requiredNonNegativeNumber,
  requiredBoolean,
  validateParameters,
} = require('./validation');

const calculateDimensions = ({
  innerWidth,
  innerDepth,
  outerHeight,
  sideLengthMultiple,
  isSideLengthMultipleSet,
  minWallThickness,
  wallThickness,
  isWallThicknessSet,
  bottomThickness,
  minBottomHoleSideLength,
  bottomClearance,
  baseClearance,
}) => {
  const wallThicknessToUse = isWallThicknessSet ? wallThickness : minWallThickness;
  const minOuterWidth = innerWidth + 2 * wallThicknessToUse;
  const minOuterDepth = innerDepth + 2 * wallThicknessToUse;
  const outerWidth = (
    isSideLengthMultipleSet
      ? getNextMultiple(minOuterWidth, sideLengthMultiple)
      : minOuterWidth
  );
  const outerDepth = (
    isSideLengthMultipleSet
      ? getNextMultiple(minOuterDepth, sideLengthMultiple)
      : minOuterDepth
  );

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
    xyHoleZPosition: baseClearance === Infinity ? bottomThickness : bottomThickness + baseClearance,
    finalDimensions: sizeToMeta([outerWidth, outerDepth, outerHeight]),
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
    bottomHoleExists: bottomHoleWidth > 0 && bottomHoleDepth > 0,
    bottomHole: {
      ...sizeToMeta(size),
      cube: cube({ size }).translate(position),
    },
  };
};

const createXHole = ({
  innerWidth,
  outerWidth,
  outerDepth,
  outerHeight,
  xyHoleZPosition,
  xClearance,
}) => {
  const holeWidth = innerWidth - 2 * xClearance;
  const size = [
    holeWidth,
    outerDepth,
    outerHeight,
  ];
  const position = [
    (outerWidth / 2) - (holeWidth / 2),
    0,
    xyHoleZPosition,
  ];

  const xHoleExists = xClearance !== Infinity;
  return {
    xHoleExists,
    xHole: xHoleExists
      ? {
        ...sizeToMeta(size),
        ...positionToMeta(position),
        cube: cube({ size }).translate(position),
      }
      : null,
  };
};

const createYHole = ({
  innerDepth,
  outerWidth,
  outerDepth,
  outerHeight,
  xyHoleZPosition,
  yClearance,
}) => {
  const holeDepth = innerDepth - 2 * yClearance;
  const size = [
    outerWidth,
    holeDepth,
    outerHeight,
  ];
  const position = [
    0,
    (outerDepth / 2) - (holeDepth / 2),
    xyHoleZPosition,
  ];

  const yHoleExists = yClearance !== Infinity;
  return {
    yHoleExists,
    yHole: yHoleExists
      ? {
        ...sizeToMeta(size),
        ...positionToMeta(position),
        cube: cube({ size }).translate(position),
      }
      : null,
  };
};

const createContainer = ({
  outerBox,
  innerBox,
  bottomHoleExists,
  bottomHole,
  xHoleExists,
  xHole,
  yHoleExists,
  yHole,
}) => {
  const differenceList = [
    outerBox.cube,
    innerBox.cube,
  ];

  if (bottomHoleExists) {
    differenceList.push(bottomHole.cube);
  }

  if (xHoleExists) {
    differenceList.push(xHole.cube);
  }

  if (yHoleExists) {
    differenceList.push(yHole.cube);
  }

  const container = difference(...differenceList);
  return {
    container,
    entity: container,
  };
};

const createDebug = ({
  innerBox,
  outerBox,
  bottomHole,
  widthWallThickness,
  depthWallThickness,
  bottomThickness,
  xHole,
  yHole,
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
    xHoleSize: _.get(xHole, 'size', null),
    xHolePosition: _.get(xHole, 'position', null),
    yHoleSize: _.get(yHole, 'size', null),
    yHolePosition: _.get(yHole, 'position', null),
  },
});

const makeContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  sideLengthMultiple = null,
  minWallThickness = 1,
  wallThickness = null,
  bottomThickness = 1,
  minBottomHoleSideLength = 5,
  bottomClearance = 16,
  baseClearance = Infinity,
  xClearance = Infinity,
  yClearance = Infinity,
  ignoreDecimalPrecision = false,
  ...extraParameters
} = {}) => {
  const parameters = {
    innerWidth,
    innerDepth,
    outerHeight,
    sideLengthMultiple,
    isSideLengthMultipleSet: sideLengthMultiple !== null,
    minWallThickness,
    wallThickness,
    isWallThicknessSet: wallThickness !== null,
    bottomThickness,
    minBottomHoleSideLength,
    bottomClearance,
    baseClearance,
    xClearance,
    yClearance,
    ignoreDecimalPrecision,
  };

  const requiredInnerDimension = () => Joi.number().precision(1).greater(Joi.ref('minBottomHoleSideLength')).required();

  validateParameters(parameters, extraParameters, {
    innerWidth: requiredInnerDimension(),
    innerDepth: requiredInnerDimension(),
    outerHeight: requiredPositiveInteger(),
    sideLengthMultiple: requiredPositiveInteger().allow(null),
    isSideLengthMultipleSet: requiredBoolean(),
    minWallThickness: requiredPositiveNumber(),
    wallThickness: requiredPositiveNumber().allow(null),
    isWallThicknessSet: requiredBoolean(),
    bottomThickness: requiredPositiveNumber(),
    minBottomHoleSideLength: requiredNonNegativeInteger(),
    bottomClearance: requiredNonNegativeNumber().allow(Infinity),
    baseClearance: requiredNonNegativeInteger().allow(Infinity),
    xClearance: requiredNonNegativeInteger().allow(Infinity),
    yClearance: requiredNonNegativeInteger().allow(Infinity),
    ignoreDecimalPrecision: requiredBoolean,
  });

  return assembleMeta(
    parameters,
    calculateDimensions,
    createOuterBox,
    createInnerBox,
    createBottomHole,
    createXHole,
    createYHole,
    createContainer,
    createDebug,
  );
};

module.exports = {
  makeContainer,
  buildMakeContainerWithDefaults: buildBuildWithDefaults(makeContainer),
};
