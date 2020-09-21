const {
  primitives3d: { cube },
  booleanOps: { union },
} = require('@jscad/csg/api');
const _ = require('lodash');

module.exports.makeShims = (shimGroups = [], index = null) => {
  const filteredShimGroups = index === null
    ? shimGroups
    : [shimGroups[index]];

  const allPoints = _.flatten(filteredShimGroups);
  const leftEdge = _.minBy(allPoints, 'x').x;
  const topEdge = _.minBy(allPoints, 'y').y;

  const pointLength = 1;
  const shimHeight = 9;
  return union(
    ...filteredShimGroups.map((group) => (
      union(
        ...group.map(({ x, y }) => (
          cube({ size: [pointLength, pointLength, shimHeight] })
            .translate([-x + leftEdge, y - topEdge, 0])
        )),
      )
    )),
  );
};
