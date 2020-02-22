const { makeCardRail } = require('./makeCardRail');
const { makeDamageContainer } = require('./makeDamageContainer');
const { makeCardBank } = require('./makeCardBank');
const { makeContainer } = require('../lib/makeContainer');
const { makeDemo } = require('./makeDemo');

global.main = () => {
  const wallThickness = 0.8;
  const bottomThickness = 0.6;
  const fourCardBankParameters = {
    numberOfCards: 4,
    outerHeight: 2,
    dividerThickness: wallThickness,
  };
  const drawDiscardHeight = 20;

  const metaMap = makeDemo({
    cardRail1Meta: makeCardRail({
      numberOfCards: 2,
      baseHeight: drawDiscardHeight,
    }),
    cardRail2Meta: makeCardRail({
      numberOfCards: 3,
    }),
    cardRail3Meta: makeCardRail({
      numberOfCards: 3,
    }),
    damageContainerMeta: makeDamageContainer({
      numberOfCards: 8,
      baseHeight: bottomThickness,
    }),
    drawDiscardMeta: makeCardBank({
      numberOfCards: 2,
      outerHeight: drawDiscardHeight,
      dividerThickness: wallThickness,
    }),
    provisionedMeta: makeCardBank(fourCardBankParameters),
    itemsMeta: makeCardBank(fourCardBankParameters),
    playerCardMeta: makeContainer({
      innerWidth: 120,
      innerDepth: 70,
      outerHeight: 2,
      bottomThickness,
      bottomClearance: 5,
      wallThickness,
    }),
  });

  const { entity } = metaMap.demoMeta;
  return entity;
};
