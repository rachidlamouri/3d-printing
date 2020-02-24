const { makeCardRail } = require('./makeCardRail');
const { makeDamageContainer } = require('./makeDamageContainer');
const { makeCardBank } = require('./makeCardBank');
const { makePlayerCard } = require('./makePlayerCard');
const { makeDemo } = require('./makeDemo');

global.main = () => {
  const wallThickness = 0.8;
  const bottomThickness = 1;
  const plateHoleTolerance = 1;
  const plateTopTolerance = 0.2;
  const fourCardBankParameters = {
    numberOfCards: 4,
    outerHeight: 2,
    dividerThickness: wallThickness,
    plateHoleTolerance,
    bottomThickness,
  };
  const drawDiscardHeight = 20;
  const railHeight = 12;

  const metaMap = makeDemo({
    containerBottomThickness: bottomThickness,
    plateTopTolerance,
    metaMap: {
      cardRail1Meta: makeCardRail({
        numberOfCards: 2,
        baseHeight: drawDiscardHeight,
        plateHoleTolerance,
        bottomThickness,
      }),
      cardRail2Meta: makeCardRail({
        numberOfCards: 3,
        baseHeight: railHeight,
        plateHoleTolerance,
        bottomThickness,
      }),
      cardRail3Meta: makeCardRail({
        numberOfCards: 3,
        baseHeight: railHeight,
        plateHoleTolerance,
        bottomThickness,
      }),
      damageContainerMeta: makeDamageContainer({
        numberOfCards: 8,
        baseHeight: bottomThickness,
      }),
      drawDiscardMeta: makeCardBank({
        numberOfCards: 2,
        outerHeight: drawDiscardHeight,
        dividerThickness: wallThickness,
        plateHoleTolerance,
        bottomThickness,
      }),
      provisionedMeta: makeCardBank(fourCardBankParameters),
      itemsMeta: makeCardBank(fourCardBankParameters),
      playerCardMeta: makePlayerCard({
        innerWidth: 120,
        innerDepth: 70,
        outerHeight: 4,
        bottomThickness,
        bottomClearance: 5,
        plateHoleTolerance,
        wallThickness,
      }),
    },
  });

  const { entity } = metaMap.playerCardMeta;
  return entity;
};
