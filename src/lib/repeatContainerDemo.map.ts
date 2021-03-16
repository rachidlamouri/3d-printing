import _ from 'lodash';
import {
  ExpandStrategy,
  RepeatContainer,
} from './containers';
import { buildExportsForMap } from './typedUtils';

const map = {
  containerCountX: () => new RepeatContainer({
    containerCountX: 5,
    wallThickness: 1,
    innerLength: 20,
    baseThickness: 1,
    outerHeight: 20,
  }),
  containerCountY: () => new RepeatContainer({
    containerCountY: 5,
    wallThickness: 1,
    innerLength: 20,
    baseThickness: 1,
    outerHeight: 20
  }),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
