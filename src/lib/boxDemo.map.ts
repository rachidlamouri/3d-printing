import _ from 'lodash';
import {
  Box,
  BoxOptions,
} from './containers';
import { buildExportsForMap } from './typedUtils';

const staticBoxOptions: BoxOptions = {
  innerLength: 40,
  wallThickness: 1,
  baseThickness: 1,
  outerHeight: 20,
  lidSupportHeightFraction: .5,
  lidAllowance: 0.1,
};

const map = {
  staticContainer: () => new Box(staticBoxOptions).container,
  staticLid: () => new Box(staticBoxOptions).lid,
  staticSideBySideX: () => new Box(staticBoxOptions).sideBySideX,
  staticSideBySideY: () => new Box(staticBoxOptions).sideBySideY,
  independentWidthAndDepth: () => new Box({
    innerWidth: 20,
    innerDepth: 30,
    wallThicknessX: 1,
    wallThicknessY: 2,
    lidAllowanceX: 0.1,
    lidAllowanceY: 0.2,
    lidAllowanceZ: 0.3,
    baseThickness: 1,
    outerHeight: 20,
    lidSupportHeightFraction: 0.6,
  }).sideBySideX,
  noLidSupport: () => new Box({
    innerLength: 20,
    wallThickness: 1,
    baseThickness: 0.5,
    outerHeight: 20,
    lidSupportHeightFraction: 0,
    lidAllowance: 0.1
  }).sideBySideX,
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
