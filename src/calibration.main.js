global.main = () => {
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
  };

  return map.elephantsFoot;
};
