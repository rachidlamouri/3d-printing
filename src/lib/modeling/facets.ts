const fs = require('fs');

const outdir = 'build/facets/';

if (!fs.existsSync(outdir)) {
  fs.mkdirSync(outdir);
}

class Vector3D {
  x: Number
  y: Number
  z: Number

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Vector2D extends Vector3D {
  constructor(x: number, y: number) {
    super(x, y, 0)
  }
}

class Facet {
  normal: Vector3D
  vertex1: Vector3D
  vertex2: Vector3D
  vertex3: Vector3D

  constructor(normal: Vector3D, vertex1: Vector3D, vertex2: Vector3D, vertex3: Vector3D) {
    this.normal = normal;
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.vertex3 = vertex3;
  }
}

const generate = (name: string, facets: Facet[]) => {
  const data = (
`solid${
    facets.map((facet) => (`
  facet normal ${facet.normal.x} ${facet.normal.y} ${facet.normal.z}
    outer loop
      vertex ${facet.vertex1.x} ${facet.vertex1.y} ${facet.vertex1.z}
      vertex ${facet.vertex2.x} ${facet.vertex2.y} ${facet.vertex2.z}
      vertex ${facet.vertex3.x} ${facet.vertex3.y} ${facet.vertex3.z}
    endloop
  endfacet`
    ))
  }
endsolid
`);

  fs.writeFileSync(`${outdir}${name}.stl`, data, 'utf8');
};

const upNormal = new Vector3D(0, 0, 1);
const downNormal = new Vector3D(0, 0, -1);
const rightNormal = new Vector3D(1, 0, 0);
const leftNormal = new Vector3D(-1, 0, 0);
const awayNormal = new Vector3D(0, 1, 0);
const towardNormal = new Vector3D(0, -1, 0);

generate('triangles', [
  new Facet(
    upNormal,
    new Vector2D(0, 0),
    new Vector2D(10, 0),
    new Vector2D(10, 10),
  ),
  new Facet(
    downNormal,
    new Vector2D(10, 10),
    new Vector2D(20, 0),
    new Vector2D(10, 0),
  ),
]);

generate('square', [
  new Facet(
    upNormal,
    new Vector2D(0, 0),
    new Vector2D(10, 0),
    new Vector2D(10, 10),
  ),
  new Facet(
    upNormal,
    new Vector2D(0, 0),
    new Vector2D(10, 10),
    new Vector2D(0, 10),
  ),
]);

generate('cube', [
  // top
  new Facet(
    downNormal,
    new Vector3D(0, 0, 10),
    new Vector3D(10, 0, 10),
    new Vector3D(10, 10, 10),
  ),
  new Facet(
    downNormal,
    new Vector3D(0, 0, 10),
    new Vector3D(10, 10, 10),
    new Vector3D(0, 10, 10),
  ),

  // bottom
  new Facet(
    upNormal,
    new Vector3D(0, 0, 0),
    new Vector3D(10, 10, 0),
    new Vector3D(10, 0, 0),
  ),
  new Facet(
    upNormal,
    new Vector3D(0, 0, 0),
    new Vector3D(0, 10, 0),
    new Vector3D(10, 10, 0),
  ),

  // right
  new Facet(
    rightNormal,
    new Vector3D(10, 0, 0),
    new Vector3D(10, 10, 0),
    new Vector3D(10, 10, 10),
  ),
  new Facet(
    rightNormal,
    new Vector3D(10, 0, 0),
    new Vector3D(10, 10, 10),
    new Vector3D(10, 0, 10),
  ),

  // left
  new Facet(
    leftNormal,
    new Vector3D(0, 0, 0),
    new Vector3D(0, 10, 10),
    new Vector3D(0, 10, 0),
  ),
  new Facet(
    leftNormal,
    new Vector3D(0, 0, 0),
    new Vector3D(0, 0, 10),
    new Vector3D(0, 10, 10),
  ),

  // front
  new Facet(
    towardNormal,
    new Vector3D(0, 0, 0),
    new Vector3D(10, 0, 0),
    new Vector3D(10, 0, 10),
  ),
  new Facet(
    towardNormal,
    new Vector3D(0, 0, 0),
    new Vector3D(10, 0, 10),
    new Vector3D(0, 0, 10),
  ),

  // back
  new Facet(
    awayNormal,
    new Vector3D(10, 10, 0),
    new Vector3D(0, 10, 0),
    new Vector3D(0, 10, 10),
  ),
  new Facet(
    awayNormal,
    new Vector3D(10, 10, 0),
    new Vector3D(0, 10, 10),
    new Vector3D(10, 10, 10),
  ),
]);
