import { cube } from '../jscadApiWrapper';
import { CsgWrapper } from './csgWrapper';

export class RectPrism extends CsgWrapper {
  width: number;
  depth: number;
  height: number;

  constructor({
    width,
    depth,
    height,
  }: {
    width: number,
    depth: number,
    height: number,
  }) {
    super(cube([width, depth, height]))

    this.width = width;
    this.depth = depth;
    this.height = height;
  }
}
