const { makeCardRail } = require('./makeCardRail');
const { makeDamageContainer } = require('./makeDamageContainer');

global.main = () => {
  const meta = {
    cardRail: makeCardRail(4),
    damageContainer: makeDamageContainer(3),
  };

  const { entity } = meta.damageContainer;
  return entity;
};
