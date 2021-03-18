import _ from 'lodash';
import {
  union,
  difference,
  intersection,
  transform,
} from '../jscadApiWrapper';
import { degreesToRadians } from '../typedUtils';

interface Position {
  x: number,
  y: number,
  z: number,
}

interface BaseOptions {
  name?: string;
}

interface CsgOptions extends BaseOptions {
  position: Position;
  csg: Csg;
}

interface WrapperOptions extends BaseOptions {
  wrapper: CsgWrapper;
}

type CsgWrapperOptons = CsgOptions | WrapperOptions;

export class CsgWrapper {
  name: string;
  position: Position;
  _csg: Csg;

  constructor(options: CsgWrapperOptons) {
    this.name = options.name;

    if ('csg' in options) {
      this.csg = options.csg;
      this.position = options.position;
    } else {
      this.csg = options.wrapper.csg;
      this.position = { ...options.wrapper.position };
    }
  }

  static union (...csgWrappers: CsgWrapper[]) {
    const validWrappers = csgWrappers.filter(({ csg }) => csg !== null);

    return new CsgWrapper({
      position: {
        x: _.meanBy(validWrappers, ({ position }) => position.x),
        y: _.meanBy(validWrappers, ({ position }) => position.y),
        z: _.meanBy(validWrappers, ({ position }) => position.z),
      },
      csg: union(...validWrappers.map(({ csg }) => csg)),
    });
  }

  static difference(...csgWrappers: CsgWrapper[]) {
    return CsgWrapper.subtract(...csgWrappers);
  }

  static subtract(...csgWrappers: CsgWrapper[]) {
    const validWrappers = csgWrappers.filter(({ csg }) => csg !== null);

    return validWrappers.length > 0
      ? new CsgWrapper({
        position: { ...validWrappers[0].position },
        csg: difference(...validWrappers.map(({ csg }) => csg)),
      })
      : new CsgWrapper({
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        csg: null
      });
  }

  static intersect(...csgWrappers: CsgWrapper[]) {
    const validWrappers = csgWrappers.filter(({ csg }) => csg !== null);

    return validWrappers.length > 0
      ? new CsgWrapper({
        position: {
          x: _.meanBy(validWrappers, ({ position }) => position.x),
          y: _.meanBy(validWrappers, ({ position }) => position.y),
          z: _.meanBy(validWrappers, ({ position }) => position.z),
        },
        csg: intersection(...validWrappers.map(({ csg }) => csg)),
      })
      : new CsgWrapper({
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        csg: null
      });
  }

  get csg() {
    return this._csg;
  }

  set csg(value) {
    this._csg = _.isNil(value) ? null : value;
  }

  copy() {
    return new CsgWrapper({
      position: { ... this.position },
      csg: this.csg,
    });
  }

  translateXYZ(xDistance: number, yDistance: number, zDistance: number) {
    this.position.x += xDistance;
    this.position.y += yDistance;
    this.position.z += zDistance;
    this.csg = this.csg?.translate([xDistance, yDistance, zDistance]);
    return this;
  }

  translateXY(xDistance: number, yDistance: number) {
    return this.translateXYZ(xDistance, yDistance, 0);
  }

  translateXZ(xDistance: number, zDistance: number) {
    return this.translateXYZ(xDistance, 0, zDistance);
  }

  translateYZ(yDistance: number, zDistance: number,) {
    return this.translateXYZ(0, yDistance, zDistance);
  }

  translateX(distance: number) {
    return this.translateXYZ(distance, 0, 0);
  }

  translateY(distance: number) {
    return this.translateXYZ(0, distance, 0);
  }

  translateZ(distance: number) {
    return this.translateXYZ(0, 0, distance);
  }

  rotateX(degrees: number) {
    const position = { ...this.position };
    const radians = degreesToRadians(degrees);

    this.centerXYZ();
    this.csg = transform(
      [
        1, 0, 0, 0,
        0, Math.cos(radians), -Math.sin(radians), 0,
        0, Math.sin(radians), Math.cos(radians), 0,
        0, 0, 0, 1,
      ],
      this.csg,
    );
    this.translateXYZ(position.x, position.y, position.z);

    return this;
  }

  rotateY(degrees: number) {
    const position = { ...this.position };
    const radians = degreesToRadians(degrees);

    this.centerXYZ();
    this.csg = transform(
      [
        Math.cos(radians), 0, Math.sin(radians), 0,
        0, 1, 0, 0,
        -Math.sin(radians), 0, Math.cos(radians), 0,
        0, 0, 0, 1,
      ],
      this.csg,
    );
    this.translateXYZ(position.x, position.y, position.z);

    return this;
  }

  rotateZ(degrees: number) {
    const position = { ...this.position };
    const radians = degreesToRadians(degrees);

    this.centerXYZ();
    this.csg = transform(
      [
        Math.cos(radians), -Math.sin(radians), 0, 0,
        Math.sin(radians), Math.cos(radians), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
      this.csg,
    );
    this.translateXYZ(position.x, position.y, position.z);

    return this;
  }

  centerXY() {
    return this.translateXY(-this.position.x, -this.position.y);
  }

  centerXYZ() {
    return this.translateXYZ(-this.position.x, -this.position.y, -this.position.z);
  }

  union(...csgWrappers: CsgWrapper[]) {
    return CsgWrapper.union(this, ...csgWrappers);
  }

  difference(...csgWrappers: CsgWrapper[]) {
    return CsgWrapper.subtract(this, ...csgWrappers);
  }

  subtract(...csgWrappers: CsgWrapper[]) {
    return CsgWrapper.subtract(this, ...csgWrappers);
  }

  intersect (...csgWrappers: CsgWrapper[]) {
    return CsgWrapper.intersect(this, ...csgWrappers);
  }

  tap(callback: Function) {
    callback(this);
    return this;
  }

  log(data = {}) {
    console.log(`${this.name}:`, {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      ...data,
    });

    return this;
  }
}
