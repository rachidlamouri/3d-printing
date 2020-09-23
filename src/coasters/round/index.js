const {
  primitives3d: { cylinder, cube },
  booleanOps: { difference, union },
  color: { css2rgb },
} = require('@jscad/csg/api');

const center = [true, true, false];
const resolution = 128;

const coasterOuterDiameter = 86;
const coasterHeight = 4;
const coasterBottomThickness = 2;
const holderBottomThickness = 2;

const createCoaster = () => {
  const outerDiameter = coasterOuterDiameter;
  const bottomThickness = coasterBottomThickness;
  const wallThickness = 2;
  const innerDiameter = outerDiameter - 2 * wallThickness;

  const outerCylinder = cylinder({
    center,
    d: outerDiameter,
    h: coasterHeight,
    fn: resolution,
  });

  const innerCylinder = cylinder({
    center,
    d: innerDiameter,
    h: coasterHeight - bottomThickness,
    fn: resolution,
  })
    .translate([0, 0, bottomThickness]);

  return difference(
    outerCylinder,
    innerCylinder,
  );
};

const createHolder = () => {
  const wallThickness = 2;
  const bottomThickness = holderBottomThickness;
  const radialTolerance = 0.3;
  const heightExtension = 1;
  const height = bottomThickness + 4 * coasterHeight + heightExtension;
  const outerDiameter = coasterOuterDiameter + 2 * wallThickness;
  const innerDiameter = outerDiameter - 2 * (wallThickness - radialTolerance);

  const outerCylinder = cylinder({
    center,
    d: outerDiameter,
    h: height,
    fn: resolution,
  });

  const innerCylinder = cylinder({
    center,
    d: innerDiameter,
    h: height - bottomThickness,
    fn: resolution,
  })
    .translate([0, 0, bottomThickness]);

  const thumbHoles = cube({
    center,
    size: [
      outerDiameter,
      20,
      height - bottomThickness,
    ],
  })
    .translate([0, 0, bottomThickness]);

  return difference(
    outerCylinder,
    innerCylinder,
    thumbHoles,
  );
};

module.exports = {
  coaster: createCoaster(),
  holder: createHolder(),
  demo: union(
    ...['navy', 'slategray', 'slateblue', 'honeydew'].map((cssColor, index) => (
      createCoaster()
        .setColor(css2rgb(cssColor))
        .translate([0, 0, (index + 1) * holderBottomThickness + index * coasterBottomThickness])
    )),
    createHolder(),
  ),
};
