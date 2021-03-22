import _ from 'lodash';
import {
  ExpandStrategy,
  Container,
  ContainerOptions,
  RepeatContainer,
  RepeatContainerOptions,
  Box,
  BoxOptions,
} from '../lib/containers';
import { buildExportsForMap } from '../lib/typedUtils';

const officeOptions = {
  sideMultiple: 5,
  baseThickness: 0.3,
  expandStrategy: ExpandStrategy.inside,
}

class OfficeContainer extends Container {
  constructor(options: ContainerOptions) {
    super({
      ...options,
      ...officeOptions,
    })
  }
}

class RepeatOfficeContainer extends RepeatContainer {
  constructor(options: RepeatContainerOptions) {
    super({
      ...options,
      ...officeOptions,
    })
  }
}

const defaultBoxHeight = 30;

class OfficeBox extends Box {
  constructor(options: BoxOptions) {
    super({
      ...options,
      ...officeOptions,
      outerHeight: options.outerHeight || defaultBoxHeight,
      lidAllowance: 0.15,
      lidSupportHeightFraction: .4,
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
  rocketBookPens: () => new OfficeContainer({
    outerWidth: 50,
    outerDepth: 20,
    outerHeight: 100,
  }),
  rocketBookCloth: () => new OfficeBox({
    outerWidth: 70,
    outerDepth: 60,
    outerHeight: 40,
  }).sideBySideX,
  rocketBookClothBox: () => new OfficeContainer({
    innerWidth: 60,
    innerDepth: 40,
    outerHeight: 40,
    baseSupportLength: 12,
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
  bookmarkPostIts: () => new RepeatOfficeContainer({
    containerCountX: 2,
    innerWidth: 5,
    innerDepth: 19,
    outerHeight: 30,
    baseHoleWidth: 1,
    baseSupportLengthY: 10,
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
  erasers: () => new RepeatOfficeContainer({
    containerCountX: 4,
    innerWidth: 10.5,
    innerDepth: 25.5,
    baseHoleWidth: 1,
    baseHoleDepth: 5,
    outerHeight: 30,
  }),
  labelMakerLabels: () => new RepeatOfficeContainer({
    containerCountX: 4,
    innerWidth: 17,
    innerDepth: 65,
    outerHeight: 40,
    baseHoleWidth: 5,
    baseSupportLengthY: 20,
    braceHeight: 20,
    braceLengthX: 8,
    braceLengthY: 20,
  }),
  sdCards: () => new RepeatOfficeContainer({
    containerCountX: 4,
    innerWidth: 2.4,
    innerDepth: 24.2,
    outerHeight: 20,
    baseHoleWidth: 1,
    baseSupportLengthY: 10,
  }),
  mechanicalPencilRefills: () => new RepeatOfficeContainer({
    containerCountX: 2,
    innerWidth: 9,
    innerDepth: 20,
    outerHeight: 40,
    baseHoleWidth: 2,
    baseSupportLengthY: 10,
  }),
  androidPhone: () => new OfficeContainer({
    outerWidth: 150,
    innerDepth: 12.5,
    outerHeight: 40,
    braceHeight: 20,
    braceLength: 50,
    baseHoleDepth: 2,
    baseSupportLengthX: 50
  }),
  paperClips: () => new OfficeBox({
    outerLength: 40,
  }).sideBySideX,
  paperClipsBox: () => new OfficeContainer({
    innerWidth: 40,
    innerDepth: defaultBoxHeight,
    outerHeight: 20,
    baseSupportLength: 12,
  }),
  staples: () => new OfficeBox({
    outerLength: 40,
  }).sideBySideX,
  staplesBox: () => new OfficeContainer({
    innerWidth: 40,
    innerDepth: defaultBoxHeight,
    outerHeight: 20,
    baseSupportLength: 12,
  }),
  binderClips: () => new OfficeBox({
    outerWidth: 55,
    outerDepth: 45,
  }).sideBySideY,
  binderClipsBox: () => new OfficeContainer({
    innerWidth: 45,
    innerDepth: defaultBoxHeight,
    outerHeight: 30,
    baseSupportLength: 12,
  }),
  thumbtacks: () => new OfficeBox({
    outerLength: 60,
  }).sideBySideX,
  thumbtacksBox: () => new OfficeContainer({
    innerWidth: 60,
    innerDepth: defaultBoxHeight,
    outerHeight: 30,
    baseSupportLength: 12,
  }),

  // TODO: move to tools.map.ts
  gafferTape: () => new OfficeContainer({
    innerWidth: 110,
    innerDepth: 52,
    baseSupportLength: 15,
    braceHeight: 20,
    braceLength: 20,
    outerHeight: 60,
  }),
  string: () => new OfficeContainer({
    innerWidth: 84,
    innerDepth: 58,
    baseSupportLength: 15,
    braceHeight: 22,
    braceLength: 22,
    outerHeight: 40,
  }),
};

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
