const { makeContainer } = require('./makeContainer');
const { makeRepeatContainer } = require('./makeRepeatContainer');
const { makeOrigin } = require('./makeOrigin');

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
