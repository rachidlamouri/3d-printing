const { Cube, CsgMeta } = require('../lib/utils');

class Hook extends CsgMeta {
  constructor({
    armThickness = 2.5,
    depth,
    connectorWidth,
    armHeight,
    hookWidth,
    hookHeight,
  } = {}) {
    const outerArm = new Cube({
      width: armThickness,
      depth,
      height: armHeight,
    });

    const armConnector = new Cube({
      width: connectorWidth,
      depth,
      height: armThickness,
    })
      .translateX(outerArm.width)
      .translateZ(armHeight - armThickness);

    const innerArm = new Cube({
      width: armThickness,
      depth,
      height: armHeight,
    })
      .translateX(outerArm.width + armConnector.width);

    const hookBottom = new Cube({
      width: hookWidth,
      depth,
      height: armThickness,
    })
      .translateX(outerArm.width + armConnector.width + innerArm.width);

    const hookArm = new Cube({
      width: armThickness,
      depth,
      height: hookHeight,
    })
      .translateX(outerArm.width + armConnector.width + innerArm.width + hookBottom.width);

    const hook = outerArm.union(
      armConnector,
      innerArm,
      hookBottom,
      hookArm,
    );

    super(hook);
  }
}

module.exports.main = () => new Hook({
  armThickness: 0.8,
  connectorWidth: 4.5,
  depth: 10,
  armHeight: 20,
  hookWidth: 2,
  hookHeight: 6,
}).csg;
