const _ = require('lodash');

const getNextMultiple = (value, multiplier) => Math.ceil(value / multiplier) * multiplier;

module.exports.makeContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  sideLengthMultiple = 2,
  minWallThickness = 2,
  bottomThickness = 1,
  minBottomHoleSideLength = 5,
  bottomClearance = 16,
} = {}) => {
  [
    [innerWidth, 'innerWidth'],
    [innerDepth, 'innerDepth'],
    [outerHeight, 'outerHeight'],
    [sideLengthMultiple, 'sideLengthMultiple'],
    [minBottomHoleSideLength, 'minBottomHoleSideLength'],
    [bottomClearance, 'bottomClearance'],
  ].forEach(([value, valueName]) => {
    if (!_.isInteger(value)) {
      throw new Error(`${valueName} must be an integer`);
    }
  });

  [
    [innerWidth, 'innerWidth'],
    [innerDepth, 'innerDepth'],
  ].forEach(([dimension, dimensionName]) => {
    if (dimension <= minBottomHoleSideLength) {
      throw new Error(`${dimensionName} must be greater than minBottomHoleSideLength "${minBottomHoleSideLength}"`);
    }
  });

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

  const container = difference(
    outerBox,
    innerBox,
    bottomHoleBox,
  );

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
