const { makeCardRail } = require('./makeCardRail');
const { makeDamageContainer } = require('./makeDamageContainer');
const { makeCardBank } = require('./makeCardBank');

global.main = () => {
  const meta = {
    cardRail: makeCardRail(4),
    damageContainer: makeDamageContainer(3),
    drawDiscard: makeCardBank({
      numberOfCards: 2,
      outerHeight: 5,
      dividerThickness: 0.8,
    }),
  };

  const { entity } = meta.damageContainer;
  return entity;
};
