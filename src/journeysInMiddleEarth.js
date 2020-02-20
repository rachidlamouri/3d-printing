const { makeCardRail } = require('./makeCardRail');

global.main = () => {
  const meta = {
    cardRail: makeCardRail(),
  };

  const { entity } = meta.cardRail;
  return entity;
};
