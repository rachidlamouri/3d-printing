const {
  primitives3d: { cube },
} = require('@jscad/csg/api');
const { center } = require('./lib/utils');

module.exports.main = () => {
  const object = cube([10, 10, 10]);

  return object.center(center);
};
