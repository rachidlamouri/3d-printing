const bottomThickness = 1;

module.exports.makeContainer = ({
  innerWidth = 20,
  innerDepth = 20,
  outerHeight = 20,
} = {}) => {
  const wallThickness = 2;

  const outerBoxSize = [
    innerWidth + 2 * wallThickness,
    innerDepth + 2 * wallThickness,
    outerHeight,
  ];

  const innerBoxSize = [
    innerWidth,
    innerDepth,
    outerHeight - bottomThickness,
  ];

  const outerBox = cube({ size: outerBoxSize });
  const innerBox = cube({ size: innerBoxSize })
    .translate([wallThickness, wallThickness, bottomThickness]);

  return difference(outerBox, innerBox);
};
