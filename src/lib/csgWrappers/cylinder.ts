import { cylinder, curveResolution } from '../jscadApiWrapper';
import { CsgWrapper } from './csgWrapper';

interface CylinderOptions {
  name?: string;
  diameter?: number;
  radius?: number;
  height?: number;
}

export class Cylinder extends CsgWrapper {
  constructor({
    name = '',
    diameter = null,
    radius = null,
    height = null,
  }: CylinderOptions) {
    const hasDiameter = diameter !== null;
    const hasRadius = radius !== null;

    if ((!hasDiameter && !hasRadius) || (hasDiameter && hasRadius)) {
      throw Error('Must provide exactly one of "diameter" or "radius"');
    }

    if (height === null) {
      throw Error('Must provide "height"');
    }

    if (!hasDiameter) {
      diameter = 2 * radius;
    }

    super({
      name,
      position: {
        x: 0,
        y: 0,
        z: height / 2,
      },
      csg: cylinder({
        d: diameter,
        h: height,
        fn: curveResolution,
      }),
    })
  }
}
