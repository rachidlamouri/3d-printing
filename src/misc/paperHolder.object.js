const { Cube } = require('../lib/utils');

module.exports.main = () => {
  const armThickness = 2.5;
  const holderDepth = 20;

  const arm1 = new Cube({
    width: armThickness,
    depth: holderDepth,
    height: 30,
  });

  const armConnector = new Cube({
    width: 5,
    depth: holderDepth,
    height: armThickness,
  })
    .translateX(arm1.width)
    .translateZ(arm1.height - armThickness);

  const arm2 = new Cube({
    width: armThickness,
    depth: holderDepth,
    height: arm1.height,
  })
    .translateX(arm1.width + armConnector.width);

  const paperTray = new Cube({
    width: arm1.height,
    depth: holderDepth,
    height: armThickness,
  })
    .translateX(arm1.width + armConnector.width + arm2.width);

  const arm3 = new Cube({
    width: armThickness,
    depth: holderDepth,
    height: arm1.height / 2,
  })
    .translateX(arm1.width + armConnector.width + arm2.width + paperTray.width);

  const paperHolder = arm1.union(
    armConnector,
    arm2,
    paperTray,
    arm3,
  )
    .centerToOrigin();

  return paperHolder.csg;
};
