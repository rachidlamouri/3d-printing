/* eslint-disable max-classes-per-file */

const {
  primitives2d: { polygon },
  primitives3d: { cube, cylinder },
  booleanOps: { difference, union },
  extrusions: { linear_extrude: linearExtrude },
  color: { html2rgb },
} = require('@jscad/csg/api');
const _ = require('lodash');

const defaultResolution = 64;

const sizeToMeta = (size) => {
  const [width, depth, height] = size;
  return {
    size,
    width,
    depth,
    height,
  };
};
const positionToMeta = (position) => {
  const [x, y, z = 0] = position;
  return {
    position: [x, y, z],
    x,
    y,
    z,
  };
};

// TODO: track centerPosition
// TODO: track cornerPosition
class CsgMeta {
  constructor(csg) {
    _.assign(this, {
      csg,
    });
  }

  centerToOrigin() {
    this.csg = this.csg.center([true, true, false]);
    return this;
  }

  colorByHtml(hexCode) {
    this.csg = this.csg.setColor(html2rgb(hexCode));
    return this;
  }

  // TODO: handle non primitive properties
  copy() {
    const copy = new CsgMeta(this.csg);
    return _.assign(copy, this);
  }

  difference(...csgMetas) {
    return new CsgMeta(difference(
      this.csg,
      ..._.map(csgMetas, 'csg'),
    ));
  }

  translateZ(height) {
    this.csg = this.csg.translate([0, 0, height]);
    return this;
  }

  union(...csgMetas) {
    return new CsgMeta(union(
      this.csg,
      ..._.map(csgMetas, 'csg'),
    ));
  }
}

class Cube extends CsgMeta {
  constructor({
    width,
    depth,
    height,
  } = {}) {
    const size = [width, depth, height];
    super(cube(size));

    _.assign(this, {
      width,
      depth,
      height,
      size,
    });
  }
}

class Cylinder extends CsgMeta {
  constructor({
    radius: r,
    diameter: d,
    height,
    allowance: {
      radius: rA = 0,
      diameter: dA = 0,
      height: heightAllowance = 0,
    } = {},
  } = {}) {
    const radius = r || d / 2;
    const diameter = d || r * 2;

    const radiusAllowance = rA || dA / 2;
    const diameterAllowance = rA || dA / 2;

    const actualRadius = radius + radiusAllowance;
    const actualDiameter = diameter + diameterAllowance;
    const actualHeight = height + heightAllowance;

    super(cylinder({
      d: actualDiameter,
      h: actualHeight,
      fn: defaultResolution,
    }));

    _.assign(this, {
      radius,
      radiusAllowance,
      actualRadius,
      diameter,
      diameterAllowance,
      actualDiameter,
      height,
      heightAllowance,
      actualHeight,
    });
  }
}

class Trapezoid extends CsgMeta {
  constructor({
    bottomDepth,
    topDepth,
    width,
    height,
  } = {}) {
    const topOffset = (bottomDepth - topDepth) / 2;

    const trapezoid2d = polygon({ points: [[0, 0], [0, bottomDepth], [-height, topOffset + topDepth], [-height, topOffset]] });
    const trapezoid3d = linearExtrude({ height: width }, trapezoid2d);
    const csg = trapezoid3d.rotateY(90);

    super(csg);
    _.assign(this, {
      bottomDepth,
      topDepth,
      width,
      height,
    });
  }
}

const getNextMultiple = (value, multiplier) => Math.ceil(value / multiplier) * multiplier;

const assembleMeta = (parameters, ...assemblerFunctions) => (
  assemblerFunctions.reduce(
    (meta, assembleAdditionalMeta) => ({
      ...meta,
      ...assembleAdditionalMeta(meta),
      initialParameters: parameters,
    }),
    parameters,
  )
);

const runWithDefaults = (entityFunction, defaults, parameters) => entityFunction({ ...defaults, ...parameters });
const buildBuildWithDefaults = _.curry(runWithDefaults);

module.exports = {
  center: [true, true, false],
  resolution: defaultResolution,
  sizeToMeta,
  Cube,
  Cylinder,
  Trapezoid,
  positionToMeta,
  getNextMultiple,
  assembleMeta,
  buildBuildWithDefaults,
};
