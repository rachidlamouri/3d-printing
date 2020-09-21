const {
  primitives3d: { cube },
  booleanOps: { union },
} = require('@jscad/csg/api');

const size = [1, 1, 20];

module.exports.makeOrigin = () => ({
  entity: union(
    cube(size)
      .setColor([1, 0, 0])
      .translate([0, 0, 0]),
    cube(size)
      .setColor([0, 0, 1])
      .translate([0, -1, 0]),
    cube(size)
      .setColor([0, 1, 0])
      .translate([-1, -1, 0]),
    cube(size)
      .setColor([0, 0, 1])
      .translate([-1, 0, 0]),
  ),
});
