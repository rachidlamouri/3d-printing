const {
  primitives3d: { cube },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const { buildMakeContainerWithDefaults } = require('../lib/makeContainer');
const { buildMakeRepeatContainerWithDefaults } = require('../lib/makeRepeatContainer');

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

const avocondoWallThickness = 6;

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
  avocondoClip: () => {
    const tolerance = 0.1;
    const wallThickness = 1;
    const wallHeight = 5;
    const baseHeight = 0.2;

    const lowerArmDepth = 2 * wallThickness + avocondoWallThickness + tolerance;
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
      .translate([wallThickness + avocondoWallThickness + tolerance, wallThickness + avocondoWallThickness + tolerance, baseHeight]);

    const entity = union(
      base,
      outerWall,
      innerWall,
    );

    return { entity };
  },
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

const main = ({ name }) => map[name]().entity;

module.exports = {
  objectNames: Object.keys(map).filter((a) => a.startsWith('avo')),
  getParameterDefinitions,
  main,
};
