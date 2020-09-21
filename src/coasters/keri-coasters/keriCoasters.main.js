const { makeBaseCoaster } = require('../lib/makeBaseCoaster');

module.exports.main = () => {
  const parameters = {
    outerHeight: 4,
    corkHeight: 2.032,
    exposedCorkHeight: 0.032,
    corkSideLength: 101.6,
    brimTolerance: 1,
    minBrimThickness: 2,
    sideLengthMultiple: 1,
  };

  const metaMap = {
    baseCoaster: makeBaseCoaster(parameters),
  };

  const { entity } = metaMap.baseCoaster;
  return entity;
};
