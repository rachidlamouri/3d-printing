import {
  Container,
  ContainerOptions,
  ExpandStrategy,
  RepeatContainer,
  RepeatContainerOptions,
  Box,
  BoxOptions,
} from '../lib/containers';
import { buildExportsForMap } from '../lib/typedUtils';

const kitchenOptions = {
  wallThickness: 0.8,
  baseThickness: 0.3,
  sideMultiple: 5,
  expandStrategy: ExpandStrategy.inside,
};

class KitchenContainer extends Container {
  constructor(options: ContainerOptions) {
    super({
      ...kitchenOptions,
      ...options,
    })
  }
}

class RepeatKitchenContainer extends RepeatContainer {
  constructor(options: RepeatContainerOptions) {
    super({
      ...kitchenOptions,
      ...options,
    })
  }
}

class KitchenBox extends Box {
  constructor(options: BoxOptions) {
    super({
      lidAllowance: 0.2,
      ...kitchenOptions,
      ...options,
    })
  }
}

const measuringCups = () => new KitchenContainer({
  innerWidth: 160,
  innerDepth: 90,
  outerHeight: 40,
  baseSupportLength: 20,
  braceHeight: 20,
  braceLength: 20,
});

const chipClips = () => new RepeatKitchenContainer({
  containerCountX: 6,
  innerWidth: 36,
  innerDepth: 85,
  outerHeight: 20,
});

const thumbtack = () => new KitchenContainer({
  innerLength: 20,
  outerHeight: 10,
});

class PlasticCutleryBox extends KitchenBox {
  constructor(options: BoxOptions) {
    super({
      outerLength: 65,
      lidSupportHeight: 100,
      ...options,
    })
  }
}

const plasticKnife = () => new PlasticCutleryBox({
  outerHeight: 180,
}).sideBySideX;

const plasticFork = () => new PlasticCutleryBox({
  outerHeight: 165,
}).sideBySideX;

const plasticSpoon = () => new PlasticCutleryBox({
  outerHeight: 155,
}).sideBySideX;

const map = {
  measuringCups,
  measuringSpoons: () => new KitchenContainer({
    innerWidth: 120,
    innerDepth: 48,
    outerHeight: 40,
    baseSupportLengthX: 30,
    baseHoleDepth: 16,
    braceHeight: 20,
    braceLengthX: 20,
  }),
  pizzaCutter: () => new KitchenContainer({
    innerWidth: 105,
    innerDepth: 10,
    outerHeight: 105,
    baseThickness: 0.6,
  }),
  canOpener: () => new KitchenContainer({
    innerWidth: 170,
    innerDepth: 50,
    outerHeight: 40,
  }),
  scissors: () => new KitchenContainer({
    innerWidth: 212,
    innerDepth: 15,
    outerHeight: 40,
  }),
  slowCookerProbe: () => new KitchenContainer({
    innerWidth: 80,
    innerDepth: 18,
    outerHeight: 20,
    braceHeight: 8,
    braceLengthY: 4,
    braceLengthX: 20,
  }),
  icecreamScoop: () => new KitchenContainer({
    innerWidth: 212,
    innerDepth: 40,
    outerHeight: 40,
  }),
  riceSpoon: () => new KitchenContainer({
    innerWidth: 202,
    innerDepth: 26,
    outerHeight: 30,
  }),
  smallThermometer: () => new KitchenContainer({
    innerWidth: 88,
    innerDepth: 22,
    outerHeight: 15,
    braceHeight: 5,
    braceLength: 8,
  }),
  oilBrush: () => new KitchenContainer({
    innerWidth: 200,
    innerDepth: 30,
    outerHeight: 30,
  }),
  potatoPeeler: () => new KitchenContainer({
    innerWidth: 184,
    innerDepth: 30,
    outerHeight: 20,
  }),
  wineOpener: () => new KitchenContainer({
    innerWidth: 175,
    innerDepth: 40,
    outerHeight: 30,
  }),
  potThermometer: () => new KitchenContainer({
    innerWidth: 58,
    innerDepth: 14,
    outerHeight: 30,
    braceHeight: 15,
    braceLength: 15,
  }),
  tinyWhisks: () => new KitchenContainer({
    innerWidth: 132,
    innerDepth: 38,
    outerHeight: 20,
    baseSupportLength: 16,
  }),
  tupperwareLidsLarge: () => new KitchenContainer({
    outerWidth: 165,
    outerDepth: 60,
    outerHeight: 60,
    braceHeight: 20,
    braceLength: 20,
  }),
  tupperwareLidsSmall: () => new KitchenContainer({
    outerWidth: 120,
    outerDepth: 60,
    outerHeight: 40,
    braceHeight: 20,
    braceLength: 26,
  }),
  umbrellas: () => new KitchenBox({
    outerLength: 105,
    outerDepth: 70,
    outerHeight: 40,
    lidSupportHeightFraction: .25,
  }).sideBySideX,
  kCups: () => new RepeatKitchenContainer({
    containerCountX: 4,
    innerLength: 52,
    outerHeight: 10,
    baseHoleLength: 38,
    baseThickness: 0.6,
  }),
  wineStoppers: () => new RepeatKitchenContainer({
    containerCountY: 2,
    innerWidth: 41,
    innerDepth: 73.4,
    outerHeight: 20,
    baseSupportLength: 12,
  }),
  tiedTeaInfuser: () => new KitchenContainer({
    outerLength: 95,
    outerDepth: 35,
    outerHeight: 30,
    braceHeight: 15,
    braceLength: 20,
  }),
  muddler: () => new KitchenContainer({
    outerLength: 225,
    outerDepth: 30,
    outerHeight: 20,
    braceHeight: 8,
    braceLength: 40,
  }),
  jigger: () => new KitchenContainer({
    innerLength: 42,
    outerHeight: 30,
    baseSupportLength: 12,
  }),
  teaBags: () => new RepeatKitchenContainer({
    containerCountX: 10,
    innerWidth: 6,
    innerDepth: 90,
    outerHeight: 30,
  }),
  chipClips,
  thumbtack,
  plasticKnife,
  plasticFork,
  plasticSpoon,
}

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap(map)
