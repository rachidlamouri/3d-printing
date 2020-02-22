const { makeOrigin } = require('../lib/makeOrigin');
const {
  assembleMeta,
} = require('../lib/utils');

const createEntity = ({
  metaMap: {
    cardRail1Meta,
    cardRail2Meta,
    cardRail3Meta,
    drawDiscardMeta,
    playerCardMeta,
    damageContainerMeta,
    provisionedMeta,
    itemsMeta,
  },
}) => {
  const entity = union(
    makeOrigin().entity,
    cardRail1Meta.entity
      .translate([
        0,
        provisionedMeta.finalDimensions.depth + drawDiscardMeta.finalDimensions.width,
      ]),
    cardRail2Meta.entity
      .translate([
        cardRail1Meta.finalDimensions.width,
        provisionedMeta.finalDimensions.depth + drawDiscardMeta.finalDimensions.width,
      ]),
    cardRail3Meta.entity
      .translate([
        cardRail1Meta.finalDimensions.width + cardRail2Meta.finalDimensions.width,
        provisionedMeta.finalDimensions.depth + drawDiscardMeta.finalDimensions.width,
      ]),
    drawDiscardMeta.entity
      .rotateZ(-90)
      .translate([
        0,
        drawDiscardMeta.finalDimensions.width + provisionedMeta.finalDimensions.depth,
      ]),
    playerCardMeta.entity
      .translate([
        drawDiscardMeta.finalDimensions.depth,
        provisionedMeta.finalDimensions.depth + (drawDiscardMeta.finalDimensions.width - playerCardMeta.finalDimensions.depth),
      ]),
    damageContainerMeta.entity
      .translate([
        drawDiscardMeta.finalDimensions.depth + playerCardMeta.finalDimensions.width,
        provisionedMeta.finalDimensions.depth + (drawDiscardMeta.finalDimensions.width - damageContainerMeta.finalDimensions.depth),
      ]),
    provisionedMeta.entity,
    itemsMeta.entity.translate([provisionedMeta.finalDimensions.width, 0, 0]),
  );

  return {
    entity,
  };
};

module.exports.makeDemo = (metaMap) => {
  const demoMeta = assembleMeta(
    { metaMap },
    createEntity,
  );

  return {
    ...metaMap,
    demoMeta,
  };
};
