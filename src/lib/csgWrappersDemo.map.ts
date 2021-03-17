import { cube, cylinder } from './jscadApiWrapper';
import {
  CsgWrapper,
  RectPrism
} from './csgWrappers';
import { buildExportsForMap } from './typedUtils';

const map = {
  csg: () => (
    new CsgWrapper({
      position: { x: 5, y: 5, z: 1 },
      csg: cube([10, 10, 2]),
    })
      .centerXY()
      .union(
        new CsgWrapper({
          position: { x: 0, y: 0, z: 5 },
          csg: cylinder({ h: 10, d: 2 }),
        })
          .translateZ(2)
          .centerXY()
      )
  ),
  rectPrism: () => new RectPrism({
    width: 20,
    depth: 10,
    height: 4,
  }),
  rotateX: () => new RectPrism({
    width: 20,
    depth: 10,
    height: 4,
  })
    .rotateX(45),
  rotateY: () => new RectPrism({
    width: 20,
    depth: 10,
    height: 4,
  })
    .rotateY(45),
  rotateZ: () => new RectPrism({
    width: 20,
    depth: 10,
    height: 4,
  })
    .rotateZ(45),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
