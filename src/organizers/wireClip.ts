import {
  CsgWrapper,
  RectangularPrism,
  Cylinder,
} from '../lib/csgWrappers';

export class WireClip extends CsgWrapper {
  constructor() {
    const armWidth = 20;
    const armDepth = 2;
    const height = 10;
    const wireAllowance = .4;
    const gapLength = 4;
    const actualGapLength = gapLength + wireAllowance;
    const hingeDiameter = 2 * armDepth + actualGapLength;
    const hingeThickness = .8;
    const hookAllowance = .2;
    const hookThickness = .8;
    const hookLength = 2;

    super({
      wrapper: CsgWrapper.union(
        new RectangularPrism({
          name: 'Front Arm',
            width: armWidth,
            depth: armDepth,
            height,
        }),
        new RectangularPrism({
          name: 'Back Arm',
            width: armWidth + hookAllowance + hookThickness,
            depth: armDepth,
            height,
        })
          .translateX(- hookAllowance - hookThickness)
          .translateY(armDepth + gapLength + wireAllowance),
        new RectangularPrism({
          name: 'Hook Arm',
            width: hookThickness,
            depth: 2 * armDepth + actualGapLength + hookAllowance,
            height,
        })
          .translateX(-hookThickness - hookAllowance)
          .translateY(-hookAllowance),
        new RectangularPrism({
          name: 'Hook',
            width: hookThickness + hookAllowance + hookLength,
            depth: hookThickness,
            height,
        })
          .translateX(-hookAllowance - hookThickness)
          .translateY(-hookThickness - hookAllowance),
        new Cylinder({
          name: 'Hinge Block',
          diameter: hingeDiameter,
          height,
        })
          .subtract(
            new Cylinder({
              radius: hingeDiameter / 2 - hingeThickness,
              height,
            }),
            new RectangularPrism({
              width: hingeDiameter,
              depth: hingeDiameter,
              height,
            })
              .centerXY()
              .translateX(-hingeDiameter / 2),
          )
          .translateXY(armWidth, armDepth + actualGapLength / 2),
      ),
    });
  }
}
