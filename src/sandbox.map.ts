import _ from 'lodash';
import {
  RectangularPrism,
} from './lib/csgWrappers';
import { buildExportsForMap } from './lib/typedUtils';

const map = {
  sandbox: () => new RectangularPrism({
    width: 20,
    depth: 20,
    height: 20,
  }),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
