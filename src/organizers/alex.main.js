const { makeContainer } = require('../lib/makeContainer');

module.exports.main = () => {
  const metaMap = {
    oof: makeContainer({
      innerWidth: 35,
      innerDepth: 16,
      outerHeight: 20,
      bottomThickness: 0.6,
      wallThickness: 0.8,
    }),
  };

  const { entity } = metaMap.oof;
  return entity;
};
