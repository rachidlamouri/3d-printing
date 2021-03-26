import { CsgWrapper } from '../lib/csgWrappers';
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
  sideMultiple: 1,
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

export const {
  main,
  getParameterDefinitions,
  objectNames,
} = buildExportsForMap({
  measuringCups,
  chipClips,
  thumbtack,
  plasticKnife,
  plasticFork,
  plasticSpoon,
})
