import _ from 'lodash';
import {
  ExpandStrategy,
  Container,
} from './containers';
import { buildExportsForMap } from './typedUtils';

const map = {
  dynamicInnerHeight: () => new Container({
    innerLength: 10,
    baseThickness: 10,
    outerHeight: 20,
  }),
  expandInside: () => new Container({
    innerLength: 12,
    sideMultiple: 5,
    expandStrategy: ExpandStrategy.inside,
    baseThickness: 0.5,
    outerHeight: 20,
  }),
  expandWalls: () => new Container({
    innerLength: 12,
    sideMultiple: 5,
    expandStrategy: ExpandStrategy.wall,
    baseThickness: 0.5,
    outerHeight: 20,
  }),
  exactDimensions: () => new Container({
    innerLength: 14,
    wallThickness: 1,
    outerLength: 16,
    sideMultiple: 4,
    expandStrategy: ExpandStrategy.none,
    baseThickness: 0.5,
    outerHeight: 20,
  }),
  bottomHole: () => new Container({
    outerLength: 20,
    expandStrategy: ExpandStrategy.inside,
    baseHoleLength: 10,
    baseThickness: 0.5,
    outerHeight: 20,
  }),
  baseSupport: () => new Container({
    outerLength: 20,
    wallThickness: 1,
    expandStrategy: ExpandStrategy.inside,
    baseSupportLength: 5,
    outerHeight: 20,
    baseThickness: 1,
  }),
  sideHoles: () => new Container({
    outerLength: 20,
    wallThickness: 0.5,
    expandStrategy: ExpandStrategy.inside,
    braceLength: 7,
    braceHeight: 6,
    outerHeight: 20,
    baseThickness: 1,
  }),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
