const {
  primitives3d: { cube, cylinder },
  booleanOps: { difference },
} = require('@jscad/csg/api');
const _ = require('lodash');
const { center, resolution } = require('../lib/utils');

const makeCup = (height) => {
  const wallThickness = 1;
  const bottomThickness = 0.3;
  const bottomDiameter = 63;
  const maxHeight = 96;
  const maxTopDiameter = 82;

  /*
            length
              |
              v
     _______|___
     \      |  /
      \  h->| /
       \____|/ <-- smaller inside angle is phi
  */

  const maxTopLength = (maxTopDiameter - bottomDiameter) / 2;
  const phi = Math.atan(maxTopLength / maxHeight);

  const topLength = height * Math.tan(phi);
  const topDiameter = bottomDiameter + 2 * topLength;

  const outerCylinder = cylinder({
    d1: bottomDiameter + 2 * wallThickness,
    d2: topDiameter + 2 * wallThickness,
    h: height,
    center,
    fn: resolution,
  });

  const innerCylinder = cylinder({
    d1: bottomDiameter,
    d2: topDiameter,
    h: height,
    center,
    fn: resolution,
  })
    .translate([0, 0, bottomThickness]);

  const bottomHole = cylinder({
    d: 0.7 * bottomDiameter,
    h: bottomThickness,
    center,
    fn: resolution,
  });

  const holeSide = 8;
  const holeDiagonal = Math.sqrt(2 * (holeSide ** 2));
  const holeCount = 16;
  const holeCubeCount = holeCount / 2;
  const angleBetweenHoles = 360 / holeCount;
  const heightCoefficient = 0.7;
  const numLevels = Math.floor(height / (heightCoefficient * holeDiagonal) - 1);

  const outerHoles = _.range(numLevels).map((level) => _.range(holeCubeCount).map((index) => (
    cube({
      size: [holeSide, 100, holeSide],
    })
      .rotateY(45)
      .center(center)
      .translate([0, 0, (level + 1) * heightCoefficient * holeDiagonal])
      .rotateZ(index * (180 / holeCubeCount) + (level % 2) * (angleBetweenHoles / 2))
  )));

  return difference(
    outerCylinder,
    innerCylinder,
    bottomHole,
    ...outerHoles.flat(),
  );
};

const map = {
  '6oz': () => makeCup(50),
  '8oz': () => makeCup(66),
  '12oz': () => makeCup(80),
};

const getParameterDefinitions = () => [
  { name: 'name', type: 'text' },
];

const main = ({ name }) => map[name]();

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions,
  main,
};
