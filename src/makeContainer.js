const _ = require('lodash');

const getNextMultiple = (value, multiplier) => Math.ceil(value / multiplier) * multiplier;

module.exports.makeContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
  sideLengthMultiple = 2,
  minWallThickness = 2,
  bottomThickness = 1,
} = {}) => {
  [
    [innerWidth, 'innerWidth'],
    [innerDepth, 'innerDepth'],
    [outerHeight, 'outerHeight'],
    [sideLengthMultiple, 'sideLengthMultiple'],
  ].forEach(([value, valueName]) => {
    if (!_.isInteger(value)) {
      throw new Error(`${valueName} must be an integer`);
    }
  });

  const innerHeight = outerHeight - bottomThickness;

  const minOuterWidth = innerWidth + 2 * minWallThickness;
  const minOuterDepth = innerDepth + 2 * minWallThickness;
  const outerWidth = getNextMultiple(minOuterWidth, sideLengthMultiple);
  const outerDepth = getNextMultiple(minOuterDepth, sideLengthMultiple);

  const widthWallThickness = (outerWidth - innerWidth) / 2;
  const depthWallThickness = (outerDepth - innerDepth) / 2;

  const outerBoxSize = [
    outerWidth,
    outerDepth,
    outerHeight,
  ];

  const innerBoxSize = [
    innerWidth,
    innerDepth,
    innerHeight,
  ];

  const outerBox = cube({ size: outerBoxSize });
  const innerBox = cube({ size: innerBoxSize })
    .translate([widthWallThickness, depthWallThickness, bottomThickness]);
  const container = difference(outerBox, innerBox);

  const containerMeta = {
    container,
    innerBoxSize,
    outerBoxSize,
    wallThicknessSize: [
      widthWallThickness,
      depthWallThickness,
      bottomThickness,
    ],
  };

  return containerMeta;
};
