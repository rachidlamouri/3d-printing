import _ from 'lodash';
import type { CsgWrapper } from './csgWrappers';

interface CreatorFunction {
  (): CsgWrapper;
}

export interface CreatorMap {
  [name: string]: CreatorFunction;
}

export const buildExportsForMap = (map: CreatorMap, singleCompile: string = null) => ({
  main: ({ name }: { name: string }): Csg => map[name]().csg,
  getParameterDefinitions: () => [
    { name: 'name', type: 'text' },
  ],
  objectNames: singleCompile === null ? Object.keys(map) : [singleCompile],
});

export const getNextMultiple = (value: number, multiplier: number) => Math.ceil(value / multiplier) * multiplier;
