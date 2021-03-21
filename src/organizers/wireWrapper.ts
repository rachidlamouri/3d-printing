import {
  CsgWrapper,
  RectangularPrism,
  Cylinder,
} from '../lib/csgWrappers';

interface WireWrapperOptions {
  pathDiameter: number;
  wireDiameter: number;
}

export class WireWrapper extends CsgWrapper {
  constructor({
    pathDiameter,
    wireDiameter,
  }: WireWrapperOptions) {
    const pathAllowance = .2;
    const wallThickness = 2;
    const baseThickness = 0.3;
    const guideHeight = 40;
    const fullHeight = baseThickness + guideHeight;

    const pathRadius = pathDiameter / 2;
    const innerPathWallRadius = pathRadius - wireDiameter / 2 - pathAllowance / 2;
    const innerHoleRadius = innerPathWallRadius - wallThickness;
    const outerPathWallRadius = pathRadius + wireDiameter / 2 + pathAllowance / 2;
    const outerRadius = outerPathWallRadius + wallThickness;

    const wallHoleLength = 20;

    super({
      wrapper: CsgWrapper.union(
        new Cylinder({
          name: 'Base',
          radius: outerRadius,
          height: baseThickness,
        }),
        CsgWrapper.union(
          new Cylinder({
            name: 'Inner Ring Block',
            radius: innerPathWallRadius,
            height: guideHeight,
          }),
          new Cylinder({
            name: 'Outer Ring Block',
            radius: outerRadius,
            height: guideHeight,
          })
            .subtract(
              new Cylinder({
                name: 'Path Hole',
                radius: outerPathWallRadius,
                height: guideHeight,
              }),
              new RectangularPrism({
                name: 'Wall Hole Template X',
                width: outerRadius - innerPathWallRadius,
                depth: wallHoleLength,
                height: guideHeight,
              })
                .centerXY()
                .replicate(2, (leftHole, rightHole,) => CsgWrapper.union(
                  leftHole.translateX(-outerPathWallRadius),
                  rightHole.translateX(outerPathWallRadius),
                )),
              new RectangularPrism({
                name: 'Wall Hole Template Y',
                width: wallHoleLength,
                depth: outerRadius - innerPathWallRadius,
                height: guideHeight,
              })
                .centerXY()
                .replicate(2, (frontHole, backHole) => CsgWrapper.union(
                  frontHole.translateY(-outerPathWallRadius),
                  backHole.translateY(outerPathWallRadius),
                )),
            ),
        )
          .translateZ(baseThickness),
      )
        .subtract(
          new Cylinder({
            name: 'Inner Ring Hole',
            radius: innerHoleRadius,
            height: fullHeight,
          })
        )
    })
  }
}
