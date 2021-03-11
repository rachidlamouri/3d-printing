import { cube } from '../jscadApiWrapper';
import { CsgWrapper } from './csgWrapper';

interface RectPrismOptions {
  name?: string;
  width: number;
  depth: number;
  height: number;
  isOptional?: boolean;
}

export class RectPrism extends CsgWrapper {
  width: number;
  depth: number;
  height: number;

  constructor({
    name,
    width,
    depth,
    height,
    isOptional = false,
  }: RectPrismOptions) {
    const isInvalid = width <= 0 || depth <= 0 || height <= 0;

    if (isInvalid && !isOptional) {
      throw Error(`invalid dimensions "${width}", "${depth}", "${height}"`);
    }

    super({
      name,
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
