import _ from 'lodash';
import type { CsgWrapper } from './csgWrappers';

interface CreatorFunction {
  (): CsgWrapper;
}

export interface CreatorMap {
  [name: string]: CreatorFunction;
}

export const buildExportsForMap = (map: CreatorMap) => ({
  main: ({ name }: { name: string }): Csg => map[name]().csg,
  getParameterDefinitions: () => [
    { name: 'name', type: 'text' },
  ],
  objectNames: Object.keys(map),
});
