const {
  primitives3d: { cube },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const { buildMakeContainerWithDefaults } = require('../lib/makeContainer');
const { buildMakeRepeatContainerWithDefaults } = require('../lib/makeRepeatContainer');
const { center } = require('../lib/utils');

const defaultWallThickness = 1;
const defaults = {
  sideLengthMultiple: 1,
  bottomThickness: 0.5,
};

const makeContainer = buildMakeContainerWithDefaults({
  minWallThickness: defaultWallThickness,
  ...defaults,
});

const makeRepeatContainer = buildMakeRepeatContainerWithDefaults({
  dividerThickness: defaultWallThickness,
  ...defaults,
});

const avocondoWallThickness = 4;

const avocondoClips = () => {
  const allowance = 0.2;
  const wallThickness = 0.8;
  const wallHeight = 6;
  const baseHeight = 2;

  const lowerArmDepth = 2 * wallThickness + avocondoWallThickness + allowance;
  const lowerArmWidth = 20;
  const fullBaseSideLength = lowerArmWidth + lowerArmDepth;

  const base = difference(
    cube([fullBaseSideLength, fullBaseSideLength, baseHeight]),
    cube([lowerArmWidth, lowerArmWidth, baseHeight])
      .translate([lowerArmDepth, lowerArmDepth]),
  );

  const outerWall = difference(
    cube([fullBaseSideLength, fullBaseSideLength, wallHeight]),
    cube([fullBaseSideLength - wallThickness, fullBaseSideLength - wallThickness, wallHeight])
      .translate([wallThickness, wallThickness]),
  )
    .translate([0, 0, baseHeight]);

  const innerWall = difference(
    cube([lowerArmWidth + wallThickness, lowerArmWidth + wallThickness, wallHeight]),
    cube([lowerArmWidth, lowerArmWidth, wallHeight])
      .translate([wallThickness, wallThickness]),
  )
    .translate([wallThickness + avocondoWallThickness + allowance, wallThickness + avocondoWallThickness + allowance, baseHeight]);

  const cornerClip = union(
    base,
    outerWall,
    innerWall,
  );

  const crossClipA = difference(
    union(
      cornerClip,
      cornerClip
        .rotateZ(180)
        .translate([2 * wallThickness, 2 * wallThickness]),
    ),
    cube([wallThickness, wallThickness, wallHeight])
      .translate([0, 0, baseHeight]),
    cube([wallThickness, wallThickness, wallHeight])
      .translate([wallThickness, wallThickness, baseHeight]),
  );

  const crossClip = difference(
    crossClipA.center(center),
    cube([wallThickness, wallThickness, wallHeight])
      .rotateZ(45)
      .center(center)
      .translate([0, 0, baseHeight]),
  );

  return {
    cornerClip: { entity: cornerClip },
    crossClip: { entity: crossClip },
  };
};

const map = {
  avocondo: () => {
    const avocadoDiameter = 70;
    const wallThickness = avocondoWallThickness;
    const arbitrarilyLargeSize = 500;

    const box = difference(
      cube([
        avocadoDiameter + 2 * wallThickness,
        avocadoDiameter,
        avocadoDiameter + 2 * wallThickness,
      ]),
      cube([avocadoDiameter, avocadoDiameter, avocadoDiameter])
        .translate([wallThickness, 0, wallThickness]),
    );

    const support = difference(
      box.rotateY(45),
      cube(arbitrarilyLargeSize, arbitrarilyLargeSize, arbitrarilyLargeSize),
    );

    const innerDiagonal = Math.sqrt(2 * (avocadoDiameter ** 2));
    const innerCornerToOuterCornerDistance = wallThickness / Math.sin(45 * (Math.PI / 180));

    const entity = union(
      support.translate([0, 0, innerDiagonal + innerCornerToOuterCornerDistance]),
      support.rotateX(180).translate([0, avocadoDiameter]),
    );

    return { entity };
  },
  avocondoCornerClip: () => avocondoClips().cornerClip,
  avocondoCrossClip: () => avocondoClips().crossClip,
  measuringCups: () => makeContainer({
    innerWidth: 160,
    innerDepth: 90,
    outerHeight: 40,
    bottomClearance: 20,
    baseClearance: 20,
    xClearance: 20,
    yClearance: 20,
  }),
  chipClips: () => makeRepeatContainer({
    count: 6,
    innerWidth: 36,
    innerDepth: 85,
    outerHeight: 20,
  }),
  thumbtack: () => makeContainer({
    innerWidth: 20,
    innerDepth: 20,
    outerHeight: 10,
    minBottomHoleSideLength: 0,
  }),
};

const getParameterDefinitions = () => [
  { name: 'name', type: 'text' },
];

const main = ({ name }) => map[name]().entity.center(center);

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions,
  main,
};
