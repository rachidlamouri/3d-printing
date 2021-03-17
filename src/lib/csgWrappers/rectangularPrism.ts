import { cube } from '../jscadApiWrapper';
import { CsgWrapper } from './csgWrapper';

interface RectangularPrismOptions {
  name?: string;
  width: number;
  depth: number;
  height: number;
  isOptional?: boolean;
}

export class RectangularPrism extends CsgWrapper {
  width: number;
  depth: number;
  height: number;

  constructor({
    name,
    width,
    depth,
    height,
    isOptional = false,
  }: RectangularPrismOptions) {
    const isInvalid = width <= 0 || depth <= 0 || height <= 0;

    if (isInvalid && !isOptional) {
      throw Error(`invalid dimensions width: "${width}", depth: "${depth}", height: "${height}"`);
    }

    super({
      name,
      position: {
        x: width / 2,
        y: depth / 2,
        z: height / 2,
      },
      csg: isInvalid ? null : cube([width, depth, height])
    });

    this.width = width;
    this.depth = depth;
    this.height = height;
  }

  log() {
    return super.log({
      width: this.width,
      depth: this.depth,
      height: this.depth,
    })
  }
}
