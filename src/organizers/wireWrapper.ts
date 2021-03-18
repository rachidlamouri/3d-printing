import {
  CsgWrapper,
  RectangularPrism,
  Cylinder,
} from '../lib/csgWrappers';

interface WireWrapperOptions {
  diameter?: number;
  wireDiameter?: number;
}

export class WireWrapper extends CsgWrapper {
  constructor({
    diameter,
  }: WireWrapperOptions) {
    const armWidth = 20;
    const guideLengthXY = 20;
    const guideLengthZ = guideLengthXY;
    const thickness = 2;
    const armLength = diameter + 2 * guideLengthXY;

    super({
      wrapper: CsgWrapper.union(
        new RectangularPrism({
          name: 'Arm',
          width: armLength,
          depth: armWidth,
          height: thickness,
        })
          .centerXY()
          .replicate(2, (armX, armY) => CsgWrapper.union(
            armX,
            armY.rotateZ(90),
          )),
        new RectangularPrism({
          name: 'Guide Block: Arm',
          width: armLength,
          depth: armWidth,
          height: guideLengthZ,
        })
          .centerXY()
          .replicate(2, (guideBlockArmX, guideBlockArmY) => CsgWrapper.union(
            guideBlockArmX,
            guideBlockArmY.rotateZ(90),
          ))
          .intersect(
            new Cylinder({
              name: 'Guide Block: Cylinder',
              diameter,
              height: guideLengthZ,
            })
          )
          .subtract(
            new Cylinder({
              name: 'Guide Block: Hole',
              diameter: diameter - 2 * thickness,
              height: guideLengthZ,
            })
          )
          .translateZ(thickness),
      )
    })
  }
}
