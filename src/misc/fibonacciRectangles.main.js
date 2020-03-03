const _ = require('lodash');
const { makeContainer } = require('../lib/makeContainer');

const bottomThickness = 1;
const height = 20;
const printSpaceTolerance = 1.4;
const containerTolerance = 1;
const containerTopTolerance = 0.1;
const scaleFactor = 2;
const count = 8;

const makeRectangle = (sideLength, previousSideLength, index, [, x, y]) => {
  const adjustedHeight = height - bottomThickness - containerTopTolerance;

  const printOnSide = sideLength < 10;
  const size = printOnSide
    ? [adjustedHeight, sideLength, sideLength]
    : [sideLength, sideLength, adjustedHeight];

  const translation = printOnSide
    ? [
      adjustedHeight * printSpaceTolerance * index,
      -sideLength * scaleFactor,
      0,
    ]
    : [
      (x * previousSideLength) + (x * printSpaceTolerance * index),
      (y * previousSideLength) + (y * printSpaceTolerance * index),
      0,
    ];

  return cube({ size })
    .translate(translation)
    .setColor(1 / index, 1 / index, 1 / index);
};

const getNextDirection = ([direction]) => (
  direction === 'up'
    ? ['right', 1, 0]
    : ['up', 0, 1]
);

global.main = () => {
  const { sequence, rectangles } = _.range(count).reduce(
    ({ sequence, rectangles, directionTuple }, index) => { // eslint-disable-line no-shadow
      const nextNumber = (
        sequence.length < 2
          ? 1
          : sequence[sequence.length - 2] + sequence[sequence.length - 1]
      );
      const sideLength = nextNumber * scaleFactor;

      const previousNumber = (
        sequence.length < 1
          ? 0
          : sequence[sequence.length - 1]
      );
      const previousSideLength = previousNumber * scaleFactor;

      const nextDirectionTuple = getNextDirection(directionTuple);

      sequence.push(nextNumber);
      rectangles.push(makeRectangle(sideLength, previousSideLength, index, nextDirectionTuple));

      return {
        sequence,
        rectangles,
        directionTuple: nextDirectionTuple,
      };
    },
    {
      sequence: [],
      rectangles: [],
      directionTuple: ['right'],
    },
  );

  const lastLength = sequence[sequence.length - 1] * scaleFactor;
  const secondToLastLength = sequence[sequence.length - 2] * scaleFactor;

  const { container } = makeContainer({
    innerWidth: lastLength + secondToLastLength + containerTolerance,
    innerDepth: lastLength + containerTolerance,
    wallThickness: 1,
    bottomThickness,
    minBottomHoleSideLength: 0,
    bottomClearance: Infinity,
  });

  logger.log(sequence);

  return union(
    container.translate([0, lastLength + (printSpaceTolerance * 12), 0]),
    ...rectangles,
  );
};
