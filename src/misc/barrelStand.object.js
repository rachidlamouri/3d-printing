const {
  primitives3d: { cube, cylinder },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const _ = require('lodash');
const { center, resolution } = require('../lib/utils');

module.exports.main = () => {
  const baseDepth = 30;
  const baseHeight = 2;
  const barrelWidth = 25;
  const wallWidth = 4;
  const wallHeight = 30;
  const holeDiameter = 4;
  const holeSpacing = 8;
  const holeOffset = holeDiameter / 2 + holeSpacing / 2;

  const base = cube([
    3 * barrelWidth + 4 * wallWidth,
    baseDepth,
    baseHeight,
  ]);

  const walls = _.range(4).map((index) => (
    cube([
      wallWidth,
      baseDepth,
      wallHeight,
    ])
      .translate([
        index * (wallWidth + barrelWidth),
        0,
        baseHeight,
      ])
  ));

  const brace = union(
    base,
    walls,
  );

  return difference(
    brace.center(center),
    cylinder({
      d: holeDiameter,
      h: baseHeight,
      center,
      fn: resolution,
    })
      .translate([0, holeOffset]),
    cylinder({
      d: holeDiameter,
      h: baseHeight,
      center,
      fn: resolution,
    })
      .translate([0, -holeOffset]),
  );
};
