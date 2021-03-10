import { cube, cylinder } from './jscadApiWrapper';
import {
  CsgWrapper,
  RectPrism
} from './csgWrappers';
import { buildExportsForMap } from './typedUtils';

const map = {
  csg: () => (
    new CsgWrapper(cube([10, 10, 2]))
      .center()
      .union(
        new CsgWrapper(cylinder({ h: 10, d: 2 }))
          .translateZ(2)
          .center()
      )
  ),
  rectPrism: () => new RectPrism({
    width: 20,
    depth: 10,
    height: 4,
  }),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
