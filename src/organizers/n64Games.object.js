const { makeRepeatContainer } = require('../lib/makeRepeatContainer');

module.exports.main = () => makeRepeatContainer({
  count: 8,
  innerWidth: 20,
  innerDepth: 117,
  outerHeight: 40,
  dividerThickness: 0.8,
  bottomThickness: 0.3,
  minBottomHoleSideLength: 0,
  bottomClearance: Infinity,
}).csg;
