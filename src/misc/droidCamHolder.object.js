const {
  primitives3d: { cube },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const { center, sizeToMeta } = require('../lib/utils');

module.exports.main = () => {
  const phoneDepth = 13;
  const wallThickness = 3;

  const base = ((size = [100, 50, 0.3]) => ({
    ...sizeToMeta(size),
    csg: cube(size),
  }))();

  const block = ((size = [base.width, 2 * wallThickness + phoneDepth, 30]) => ({
    ...sizeToMeta(size),
    csg: cube(size),
  }))();

  const hole1 = cube([50, block.depth, block.height]);
  const hole2 = cube([block.width, phoneDepth, block.height]);

  const support = difference(
    block.csg.center(center),
    hole1.center(center),
    hole2.center(center),
  );

  const object = union(
    base.csg.center(center),
    support.translate([0, 0, base.height]),
  );

  return object;
};
