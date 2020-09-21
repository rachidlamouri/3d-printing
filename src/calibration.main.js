const {
  primitives3d: { cube, cylinder },
  booleanOps: { difference, union },
} = require('@jscad/csg/api');
const { makeContainer } = require('./lib/makeContainer');

module.exports.main = () => {
  const map = {
    firstLayerHeight: cube([40, 40, 0.1]),
    perimeterWidth: difference(
      cube({
        size: [20, 20, 0.4],
        center: true,
      }),
      cube({
        size: [10, 10, 0.4],
        center: true,
      }),
    ),
    topBottomLayers: cube([40, 40, 4]),
    minimumSkirt: cube([5, 5, 1]),
    perimeterSpeed: difference(
      cube({
        size: [60, 60, 2],
        center: true,
      }),
      cylinder({
        r: 1.5,
        h: 2,
        center: true,
      }),
    ),
    bridgeInfill: union(
      cube([5, 10, 2])
        .translate([0, 0, 0]),
      cube([5, 10, 2])
        .translate([25, 0, 0]),
      cube([30, 10, 1])
        .translate([0, 0, 2]),
    ),
    gapInfill: difference(
      cube({
        size: [80, 80, 1],
        center: true,
      }),
      cube({
        size: [76, 76, 1],
        center: true,
      }),
    ),
    elephantsFoot: difference(
      cube({
        size: [30, 30, 3],
        center: true,
      }),
      cube({
        size: [20, 20, 3],
        center: true,
      }),
    ),
    noise: difference(
      cube({
        size: [40, 40, 4],
        center: true,
      }),
      cube({
        size: [38, 38, 4],
        center: true,
      }),
      cube({
        size: [20, 40, 4],
        center: true,
      }),
      cube({
        size: [40, 20, 4],
        center: true,
      }),
    ),
    yAxisNoise: union(
      cube([2, 10, 2]).translate([0, 70, 0]),
      cube([2, 10, 2]).translate([0, -70, 0]),
    ),
    noise2: difference(
      cube({
        size: [80, 80, 4],
        center: true,
      }),
      cube({
        size: [78, 78, 4],
        center: true,
      }),
    ),
    noise3: makeContainer({
      innerWidth: 133,
      innerDepth: 73,
      outerHeight: 20,
      wallThickness: 1,
      bottomClearance: 0,
    }).entity,
  };

  return map.noise3;
};
