const _ = require('lodash');
const { makeOrigin } = require('../lib/makeOrigin');
const {
  sizeToMeta,
  assembleMeta,
} = require('../lib/utils');

const createEntity = ({
  containerBottomThickness,
  plateBottomThickness,
  plateTopTolerance,
  containerEdgeTolerance,
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
  const cardRailYOffset = provisionedMeta.finalDimensions.depth + containerEdgeTolerance + drawDiscardMeta.finalDimensions.width + containerEdgeTolerance;
  const positions = {
    cardRail1: [
      0,
      cardRailYOffset,
    ],
    cardRail2: [
      cardRail1Meta.finalDimensions.width,
      cardRailYOffset,
    ],
    cardRail3: [
      cardRail1Meta.finalDimensions.width + cardRail2Meta.finalDimensions.width,
      cardRailYOffset,
    ],
    drawDiscard: [
      0,
      provisionedMeta.finalDimensions.depth + containerEdgeTolerance + drawDiscardMeta.finalDimensions.width,
    ],
    playerCard: [
      drawDiscardMeta.finalDimensions.depth + containerEdgeTolerance,
      provisionedMeta.finalDimensions.depth + containerEdgeTolerance + (drawDiscardMeta.finalDimensions.width - playerCardMeta.finalDimensions.depth),
    ],
    damageContainer: [
      drawDiscardMeta.finalDimensions.depth + containerEdgeTolerance + playerCardMeta.finalDimensions.width + containerEdgeTolerance,
      provisionedMeta.finalDimensions.depth + containerEdgeTolerance + (drawDiscardMeta.finalDimensions.width - damageContainerMeta.finalDimensions.depth),
    ],
    provisioned: [0, 0, 0],
    items: [provisionedMeta.finalDimensions.width + containerEdgeTolerance, 0, 0],
    containers: [0, 0, plateBottomThickness],
  };

  const plateHole = union(
    makeOrigin().entity,
    cardRail1Meta.plateHoleEntity
      .translate(positions.cardRail1),
    cardRail2Meta.plateHoleEntity
      .translate(positions.cardRail2),
    cardRail3Meta.plateHoleEntity
      .translate(positions.cardRail3),
    drawDiscardMeta.plateHoleMeta.entity
      .rotateZ(-90)
      .translate(positions.drawDiscard),
    playerCardMeta.plateHoleMeta.entity
      .translate(positions.playerCard),
    damageContainerMeta.plateHoleEntity
      .translate(positions.damageContainer),
    provisionedMeta.plateHoleMeta.entity.translate(positions.provisioned),
    itemsMeta.plateHoleMeta.entity.translate(positions.items),
  ).translate(positions.containers);

  const containers = union(
    makeOrigin().entity,
    cardRail1Meta.entity
      .translate(positions.cardRail1),
    cardRail2Meta.entity
      .translate(positions.cardRail2),
    cardRail3Meta.entity
      .translate(positions.cardRail3),
    drawDiscardMeta.entity
      .rotateZ(-90)
      .translate(positions.drawDiscard),
    playerCardMeta.entity
      .translate(positions.playerCard),
    damageContainerMeta.entity
      .translate(positions.damageContainer),
    provisionedMeta.entity.translate(positions.provisioned),
    itemsMeta.entity.translate(positions.items),
  ).translate(positions.containers);

  const plateDimensions = sizeToMeta([
    positions.items[0] + itemsMeta.finalDimensions.width,
    positions.cardRail1[1] + cardRail1Meta.finalDimensions.depth,
    plateBottomThickness,
  ]);
  const plateBottom = cube(plateDimensions.size).setColor([0, 1, 0]);

  const plateTopHeight = containerBottomThickness - plateTopTolerance;
  const plateTop = union(
    cube([cardRail1Meta.finalDimensions.width, cardRail1Meta.finalDimensions.depth, plateTopHeight])
      .translate(positions.cardRail1),
    cube([cardRail2Meta.finalDimensions.width, cardRail2Meta.finalDimensions.depth, plateTopHeight])
      .translate(positions.cardRail2),
    cube([cardRail3Meta.finalDimensions.width, cardRail3Meta.finalDimensions.depth, plateTopHeight])
      .translate(positions.cardRail3),
    cube([drawDiscardMeta.finalDimensions.width, drawDiscardMeta.finalDimensions.depth, plateTopHeight])
      .rotateZ(-90)
      .translate(positions.drawDiscard),
    cube([playerCardMeta.finalDimensions.width, playerCardMeta.finalDimensions.depth, plateTopHeight])
      .translate(positions.playerCard),
    cube([damageContainerMeta.finalDimensions.width, damageContainerMeta.finalDimensions.depth, plateTopHeight])
      .translate(positions.damageContainer),
    cube([provisionedMeta.finalDimensions.width, provisionedMeta.finalDimensions.depth, plateTopHeight])
      .translate(positions.provisioned),
    cube([itemsMeta.finalDimensions.width, itemsMeta.finalDimensions.depth, plateTopHeight])
      .translate(positions.items),
  )
    .translate(positions.containers)
    .setColor([0, 0, 1]);

  const finalPlate = union(
    plateBottom,
    difference(
      plateTop,
      plateHole,
    ),
  );

  const plateSectionCount = 3;
  const sectionTolerance = 0.5;
  const plateSections = _.range(plateSectionCount).map((index) => {
    const currentSectionTolerance = (index + 1) !== plateSectionCount
      ? sectionTolerance
      : 0;

    return intersection(
      finalPlate,
      cube([plateDimensions.width / plateSectionCount - currentSectionTolerance, plateDimensions.depth, 10])
        .translate([(index * plateDimensions.width) / plateSectionCount, 0]),
    );
  });

  return {
    entity: union(
      containers,
      plateSections,
    ),
  };
};

module.exports.makeDemo = ({
  metaMap,
  containerBottomThickness,
  plateTopTolerance,
  plateBottomThickness,
  containerEdgeTolerance,
}) => {
  const demoMeta = assembleMeta(
    {
      metaMap,
      containerBottomThickness,
      plateBottomThickness,
      plateTopTolerance,
      containerEdgeTolerance,
    },
    createEntity,
  );

  return {
    ...metaMap,
    demoMeta,
  };
};
