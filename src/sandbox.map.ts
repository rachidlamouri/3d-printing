import _ from 'lodash';
import {
  CsgWrapper,
  RectangularPrism,
  Cylinder
} from './lib/csgWrappers';
import {
  Container,
  RepeatContainer,
  Box,
  ExpandStrategy,
} from './lib/containers';
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
