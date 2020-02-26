const { makeCardRail } = require('./makeCardRail');
const { makeDamageContainer } = require('./makeDamageContainer');
const { makeCardBank } = require('./makeCardBank');
const { makePlayerCard } = require('./makePlayerCard');
const { makeDemo } = require('./makeDemo');

global.main = () => {
  const wallThickness = 0.8;
  const plateHoleTolerance = 0.5;
  const bottomThickness = 1.4;
  const plateBottomThickness = 0.6;
  const plateTopTolerance = 0.2;
  const singleCardTargetHeight = 1.4;
  const singleCardOuterHeight = Math.ceil(singleCardTargetHeight + bottomThickness);

  const fourCardBankParameters = {
    numberOfCards: 4,
    outerHeight: singleCardOuterHeight,
    dividerThickness: wallThickness,
    plateHoleTolerance,
    bottomThickness,
  };
  const drawDiscardHeight = 12;
  const railHeight = 12;

  const metaMap = makeDemo({
    containerEdgeTolerance: 0.2,
    containerBottomThickness: bottomThickness,
    plateTopTolerance,
    plateBottomThickness,
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
        plateHoleTolerance,
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
        outerHeight: singleCardOuterHeight,
        bottomThickness,
        bottomClearance: 5,
        plateHoleTolerance,
        wallThickness,
      }),
    },
  });

  const { entity } = metaMap.demoMeta;
  return entity;
};
