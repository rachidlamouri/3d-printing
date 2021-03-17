declare class Csg {
  center(options: boolean[]): Csg
  translate(options: number[]): Csg
}

declare module '@jscad/csg/api' {
  const primitives3d: {
    cube(options: object): Csg;
    cylinder(options: object): Csg;
  }

  const booleanOps: {
    union(...csgs: Csg[]): Csg;
    difference(...csgs: Csg[]): Csg;
  }

  const transformations: {
    transform(matrix: number[], object: Csg): Csg;
  }
}
