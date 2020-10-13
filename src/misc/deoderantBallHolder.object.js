const {
  primitives3d: { cube, cylinder, sphere },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const _ = require('lodash');
const { center, sizeToMeta, resolution } = require('../lib/utils');

module.exports.main = () => {
  const ballDiameter = 38;
  const holeDiameter = ballDiameter + 1;
  const holeRadius = holeDiameter / 2;
  const holeCount = 4;
  const edgeOffset = 2;
  const wallThickness = 0.8;
  const baseHeight = 4;
  const holeHeight = 3;
  const wallHeight = 0.6 * ballDiameter + baseHeight;
  const fingerHoleDiameter = 0.8 * ballDiameter;

  const baseSize = [
    2 * wallThickness + 2 * edgeOffset + holeCount * ballDiameter + (holeCount - 1) * edgeOffset,
    2 * wallThickness + 2 * edgeOffset + ballDiameter,
    baseHeight,
  ];

  const base = {
    ...sizeToMeta(baseSize),
    csg: cube(baseSize),
  };

  const walls = difference(
    cube([base.width, base.depth, wallHeight]),
    cube([base.width - 2 * wallThickness, base.depth - 2 * wallThickness, wallHeight])
      .translate([wallThickness, wallThickness]),
  );

  const ballHoles = _.range(holeCount).map((index) => (
    sphere({ r: holeRadius, fn: resolution })
      .translate([
        holeRadius + wallThickness + (index + 1) * edgeOffset + index * ballDiameter,
        holeRadius + wallThickness + edgeOffset,
        holeRadius + (baseHeight - holeHeight)])
  ));

  const box = union(base.csg, walls);
  const boxWithBallHoles = difference(
    box,
    ...ballHoles,
  );

  const fingerHole = cylinder({
    d: fingerHoleDiameter,
    h: base.width,
    fn: resolution,
  });

  const holder = difference(
    boxWithBallHoles.center(center),
    fingerHole
      .rotateY(90)
      .center(center)
      .translate([0, 0, wallHeight]),
  );

  return holder.center(center);
};
