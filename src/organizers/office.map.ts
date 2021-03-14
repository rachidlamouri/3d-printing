import _ from 'lodash';
import {
  ExpandStrategy,
  Container,
  ContainerOptions,
} from '../lib/containers';
import { buildExportsForMap } from '../lib/typedUtils';

class OfficeContainer extends Container {
  constructor(options: ContainerOptions) {
    super({
      ...options,
      sideMultiple: 5,
      expandStrategy: ExpandStrategy.inside,
      baseThickness: 0.3,
    })
  }
}

const map = {
  stapler: () => new OfficeContainer({
    innerWidth: 190,
    innerDepth: 45,
    outerHeight: 40,
    baseSupportLength: 15,
    braceLengthX: 30,
    braceLengthY: 15,
    braceHeight: 20,
  }),
  raspberryPi: () => new OfficeContainer({
    innerWidth: 77,
    innerDepth: 24,
    outerHeight: 40,
    baseSupportLengthY: 10,
    baseSupportLengthX: 15,
    braceHeight: 20,
    braceLengthY: 10,
    braceLengthX: 15,
  }),
  dryEraseEraser: () => new OfficeContainer({
    innerDepth: 29,
    innerWidth: 52,
    baseSupportLength: 12,
    outerHeight: 40,
    braceHeight: 20,
    braceLength: 12,
  }),
  labelMaker: () => new OfficeContainer({
    innerWidth: 203,
    innerDepth: 50,
    baseSupportLengthX: 50,
    baseSupportLengthY: 20,
    outerHeight: 60,
    braceHeight: 40,
    braceLength: 40,
  }),
  scissors: () => new OfficeContainer({
    outerWidth: 210,
    outerDepth: 15,
    outerHeight: 40,
    braceHeight: 20,
    braceLengthX: 40,
  }),
  hotGlueSticks: () => new OfficeContainer({
    outerLength: 50,
    outerHeight: 80,
  }),
  pens: () => new OfficeContainer({
    outerLength: 50,
    outerHeight: 100,
  }),
  compass: () => new OfficeContainer({
    outerWidth: 50,
    innerDepth: 17,
    outerHeight: 100,
  }),
  glueStick: () => new OfficeContainer({
    innerLength: 19.8,
    baseHoleLength: 5,
    outerHeight: 40,
  }),
  simCardKey: () => new OfficeContainer({
    outerWidth: 25,
    innerDepth: 15.1,
    outerHeight: 5,
  }),
  tape: () => new OfficeContainer({
    innerWidth: 97,
    innerDepth: 25.3,
    outerHeight: 30,
    baseSupportLength: 12,
  }),
  bigPostIts: () => new OfficeContainer({
    innerLength: 77,
    outerHeight: 10,
    braceHeight: 0,
    braceLengthX: 20,
    baseSupportLength: 20,
  }),
  smallRulers: () => new OfficeContainer({
    innerWidth: 158,
    innerDepth: 4,
    outerHeight: 20,
    braceHeight: 10,
    braceLength: 30,
  }),
  pencilSharpener: () => new OfficeContainer({
    innerWidth: 16.5,
    innerDepth: 12,
    outerHeight: 15,
    baseHoleLength: 5,
  }),
  envelopes: () => new OfficeContainer({
    outerWidth: 110,
    outerDepth: 20,
    outerHeight: 100,
    braceHeight: 30,
    braceLength: 30,
  }),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
