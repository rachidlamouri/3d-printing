const { makeCardRail } = require('./makeCardRail');

global.main = () => {
  const meta = {
    cardRail: makeCardRail(4),
  };

  const { entity } = meta.cardRail;
  return entity;
};
