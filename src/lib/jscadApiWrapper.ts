import jscadCsgApi from '@jscad/csg/api';

export const {
  primitives3d: { cube, cylinder },
  booleanOps: { union, difference },
  transformations: { transform },
} = jscadCsgApi;

export const curveResolution = 500;
