const {
  booleanOps: { difference },
} = require('@jscad/csg/api');
const { center, Cube, CsgMeta } = require('./lib/utils');
const { buildMakeContainerWithDefaults } = require('./lib/makeContainer');

const wallThickness = 0.8;
const mazeHeight = 4;
const magnetDiameter = 12;
const bottomThickness = 0.3;
const giftHeight = 2.6;
const magnetHeight = 3;

const makeContainer = buildMakeContainerWithDefaults({
  wallThickness,
  bottomThickness,
  minBottomHoleSideLength: 0,
  bottomClearance: Infinity,
});

const mazeOuterDim = {
  width: 103.4,
  depth: 77.6,
};

const mazeInnerDim = {
  width: 101.6,
  depth: 75.9,
};

const giftDim = {
  width: 25,
  depth: 57,
};

const map = {
  mazeHole: () => new Cube({
    width: magnetDiameter,
    depth: magnetDiameter,
    height: 20,
  }),
  maze: () => {
    const lines = [
      // outer walls
      [[0], [0, 6]],
      [[8], [0, 6]],
      [[0, 8], [0]],
      [[0, 8], [6]],

      // first turn
      [[0, 1], [3]],

      // top left fake and bottom left loop
      [[1], [4, 6]],
      [[1, 2], [4]],
      [[2], [1, 5]],
      [[1, 2], [2]],
      [[1], [1, 2]],
      [[1, 2], [1]],

      // bottom middle turn
      [[3], [0, 2]],
      [[3, 4], [2]],
      [[4], [0, 2]],

      // right fake
      [[6, 7], [2]],
      [[7], [2, 6]],

      // critical path
      [[4], [4, 6]],
      [[3, 5], [4]],
      [[3, 6], [3]],
      [[3], [3, 5]],
      [[5], [1, 3]],
      [[5, 7], [1]],
      [[6], [3, 5]],
      [[5, 6], [5]],
    ];

    const walls = lines.map(([[startX, endX = startX], [startY, endY = startY]]) => {
      const isHorizontal = startY === endY;

      const start = isHorizontal ? startX : startY;
      const end = isHorizontal ? endX : endY;
      const length = (end - start) * magnetDiameter + (end - start + 1) * wallThickness;

      return new Cube({
        width: isHorizontal ? length : wallThickness,
        depth: isHorizontal ? wallThickness : length,
        height: mazeHeight,
      })
        .translateX(startX * magnetDiameter + startX * wallThickness)
        .translateY(startY * magnetDiameter + startY * wallThickness);
    });

    const bottomLeftTurnFill = new Cube({
      width: magnetDiameter,
      depth: magnetDiameter,
      height: mazeHeight,
    })
      .translateX(magnetDiameter + 2 * wallThickness)
      .translateY(magnetDiameter + 2 * wallThickness);

    const bottomMiddleTurnFill = new Cube({
      width: magnetDiameter,
      depth: magnetDiameter * 2 + wallThickness,
      height: mazeHeight,
    })
      .translateX(3 * magnetDiameter + 4 * wallThickness)
      .translateY(wallThickness);

    const mazeWalls = CsgMeta.union(
      ...walls,
      bottomLeftTurnFill,
      bottomMiddleTurnFill,
    )
      .translateZ(bottomThickness);

    const base = new Cube({
      width: 8 * magnetDiameter + 9 * wallThickness,
      depth: 6 * magnetDiameter + 7 * wallThickness,
      height: bottomThickness,
    });

    const hole = map.mazeHole()
      .translateX(3 * magnetDiameter + 4 * wallThickness)
      .translateY(3 * magnetDiameter + 4 * wallThickness);

    const maze = CsgMeta.union(
      base,
      mazeWalls,
    )
      .difference(hole);

    return maze;
  },
  innerContainer: () => {
    const container = makeContainer({
      innerWidth: 8 * magnetDiameter + 7 * wallThickness,
      innerDepth: 6 * magnetDiameter + 5 * wallThickness,
      outerHeight: 2 * magnetHeight + bottomThickness,
    });

    const hole = map.mazeHole()
      .translateX(4 * magnetDiameter + 5 * wallThickness)
      .translateY(3 * magnetDiameter + 4 * wallThickness);

    return new CsgMeta(difference(
      container.csg,
      hole.csg,
    ));
  },
  innerContainerCover: () => makeContainer({
    innerWidth: mazeInnerDim.width - 2 * wallThickness,
    innerDepth: mazeInnerDim.depth - 2 * wallThickness,
    outerHeight: 2 * magnetHeight,
  }),
  giftInsert: () => new Cube({
    width: mazeOuterDim.width - 0.1,
    depth: mazeOuterDim.depth - 0.1,
    height: giftHeight,
  })
    .difference(
      map.mazeHole()
        .translateX(3 * magnetDiameter + 4 * wallThickness)
        .translateY(3 * magnetDiameter + 4 * wallThickness),
      new Cube({
        width: giftDim.width,
        depth: giftDim.depth,
        height: giftHeight,
      })
        .translateX(5)
        .translateY(5),
      new Cube({
        width: giftDim.width,
        depth: giftDim.depth,
        height: giftHeight,
      })
        .translateX(mazeOuterDim.width - giftDim.width - 5)
        .translateY(mazeOuterDim.depth - giftDim.depth - 5),
    )
    .union(
      new Cube({
        width: giftDim.width,
        depth: giftDim.depth,
        height: 0.1,
      })
        .translateX(5)
        .translateY(5),
      new Cube({
        width: giftDim.width,
        depth: giftDim.depth,
        height: 0.1,
      })
        .translateX(mazeOuterDim.width - giftDim.width - 5)
        .translateY(mazeOuterDim.depth - giftDim.depth - 5),
    ),
  lockContainer: () => makeContainer({
    innerWidth: 103.5 + 0.5,
    innerDepth: 78 + 0.5,
    outerHeight: 2 * magnetHeight + bottomThickness + giftHeight + mazeHeight + bottomThickness,
  }),
  outerContainer: () => makeContainer({
    innerWidth: 105.2,
    innerDepth: 79.7,
    outerHeight: bottomThickness + 2 * magnetHeight + bottomThickness + giftHeight + mazeHeight + bottomThickness + 1,
  }),
};

const getParameterDefinitions = () => [
  { name: 'name', type: 'text' },
];

const main = ({ name }) => map[name]().csg.center(center);

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions,
  main,
};
