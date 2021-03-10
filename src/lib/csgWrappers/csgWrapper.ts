import { union } from '../jscadApiWrapper';

export class CsgWrapper {
  csg: Csg;

  constructor(csg: Csg) {
    this.csg = csg;
  }

  translateZ(distance: number) {
    this.csg = this.csg.translate([0, 0, distance]);
    return this;
  }

  center() {
    this.csg = this.csg.center([true, true, false]);
    return this;
  }

  union(...csgWrappers: Array<CsgWrapper>) {
    const csgs = csgWrappers.map(({ csg }) => csg);
    return new CsgWrapper(union(this.csg, ...csgs));
  }
}
