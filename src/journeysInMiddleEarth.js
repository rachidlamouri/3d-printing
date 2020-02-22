const { makeCardRail } = require('./makeCardRail');
const { makeDamageContainer } = require('./makeDamageContainer');
const { makeCardBank } = require('./makeCardBank');
const { makeContainer } = require('./makeContainer');

global.main = () => {
  const wallThickness = 0.8;
  const bottomThickness = 0.6;

  const meta = {
    cardRail: makeCardRail({
      numberOfCards: 4,
    }),
    damageContainer: makeDamageContainer({
      numberOfCards: 8,
      baseHeight: bottomThickness,
    }),
    drawDiscard: makeCardBank({
      numberOfCards: 2,
      outerHeight: 20,
      dividerThickness: wallThickness,
    }),
    provisioned: makeCardBank({
      numberOfCards: 4,
      outerHeight: 2,
      dividerThickness: wallThickness,
    }),
    playerCard: makeContainer({
      innerWidth: 120,
      innerDepth: 70,
      outerHeight: 2,
      bottomThickness,
      bottomClearance: 5,
      wallThickness,
    }),
  };

  const { entity } = meta.playerCard;
  return entity;
};
