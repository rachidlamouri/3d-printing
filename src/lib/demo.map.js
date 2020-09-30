const {
  booleanOps: { union },
} = require('@jscad/csg/api');
const { makeContainer } = require('./makeContainer');
const { makeRepeatContainer } = require('./makeRepeatContainer');
const { makeOrigin } = require('./makeOrigin');
const { makeBoxAndLid } = require('./makeBoxAndLid');
const { center } = require('./utils');

const boxAndLidParameters = {
  innerWidth: undefined,
  innerDepth: undefined,
  innerHeight: undefined,
};

const map = {
  container: () => makeContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
  }),
  repeatContainer: () => makeRepeatContainer({
    innerWidth: undefined,
    innerDepth: undefined,
    outerHeight: undefined,
    count: undefined,
  }),
  boxAndLidBox: () => makeBoxAndLid(boxAndLidParameters).box,
  boxAndLidLid: () => makeBoxAndLid(boxAndLidParameters).lid,
  boxAndLid: () => {
    const { box, lid } = makeBoxAndLid(boxAndLidParameters);

    const entity = union(
      box.entity.center(center),
      lid.entity
        .rotateX(180)
        .center(center)
        .translate([0, 0, lid.finalDimensions.height])
        .setColor([0, 1, 0, 0.5]),
    );

    return { entity };
  },
  origin: () => makeOrigin(),
};

const getParameterDefinitions = () => [
  { name: 'name', type: 'text' },
];

const main = ({ name }) => map[name]().entity;

module.exports = {
  objectNames: Object.keys(map),
  getParameterDefinitions,
  main,
};
