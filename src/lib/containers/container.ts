import _ from 'lodash';
import { CsgWrapper, RectPrism } from '../csgWrappers';
import { getNextMultiple } from '../typedUtils';

export enum ExpandStrategy {
  none = 'none',
  inside = 'inside',
  wall = 'wall',
}

export interface ContainerOptions {
  name?: string,
  isOptional?: boolean,
  innerLength?: number,
  innerWidth?: number,
  innerDepth?: number,
  outerLength?: number,
  outerWidth?: number,
  outerDepth?: number,
  sideMultiple?: number,
  widthMultiple?: number,
  depthMultiple?: number,
  wallThickness?: number,
  wallThicknessX?: number,
  wallThicknessY?: number,
  expandStrategy?: ExpandStrategy,
  expandStrategyX?: ExpandStrategy,
  expandStrategyY?: ExpandStrategy,
  baseHoleLength?: number,
  baseHoleWidth?: number,
  baseHoleDepth?: number,
  baseSupportLength?: number,
  baseSupportLengthX?: number,
  baseSupportLengthY?: number,
  braceLength?: number,
  braceLengthX?: number,
  braceLengthY?: number,
  braceHeight?: number,
  baseThickness?: number,
  innerHeight?: number,
  outerHeight?: number,
}

export class Container extends CsgWrapper {
  innerWidth: number;
  innerDepth: number;
  outerWidth: number;
  outerDepth: number;
  widthMultiple: null|number;
  depthMultiple: null|number;
  wallThicknessX: number;
  wallThicknessY: number;
  expandStrategyX: ExpandStrategy;
  expandStrategyY: ExpandStrategy;
  baseHoleWidth: number;
  baseHoleDepth: number;
  baseSupportLengthX: number;
  baseSupportLengthY: number;
  braceLengthX: number;
  braceLengthY: number;
  braceHeight: number;
  baseThickness: number;
  innerHeight: number;
  outerHeight: number;

  constructor({
    name,
    isOptional = false,
    innerLength = null,
    innerWidth = innerLength,
    innerDepth = innerLength,
    outerLength = null,
    outerWidth = outerLength,
    outerDepth = outerLength,
    sideMultiple = null,
    widthMultiple = sideMultiple,
    depthMultiple = sideMultiple,
    wallThickness = 0.8,
    wallThicknessX = wallThickness,
    wallThicknessY = wallThickness,
    expandStrategy = ExpandStrategy.none,
    expandStrategyX = expandStrategy,
    expandStrategyY = expandStrategy,
    baseHoleLength = 0,
    baseHoleWidth = baseHoleLength,
    baseHoleDepth = baseHoleLength,
    baseSupportLength = Infinity,
    baseSupportLengthX = baseSupportLength,
    baseSupportLengthY = baseSupportLength,
    braceLength = Infinity,
    braceLengthX = braceLength,
    braceLengthY = braceLength,
    braceHeight = Infinity,
    baseThickness = null,
    innerHeight = null,
    outerHeight = null,
  }: ContainerOptions) {
    const heightParameterCount = _.sumBy(
      [outerHeight, innerHeight, baseThickness],
      (value: number) => value === null ? 0 : 1,
    );

    if (heightParameterCount === 3 && baseThickness + innerHeight !== outerHeight) {
      throw Error('Invalid "baseThickness", "innerHeight", "outerHeight". Either provide less dimensions, or provide exact dimensions');
    } else if (heightParameterCount < 2) {
      throw Error('Must provide at least two of "outerHeight", "innerHeight", "baseThickness"');
    } else if (outerHeight === null) {
      outerHeight = innerHeight + baseThickness;
    } else if (innerHeight === null) {
      innerHeight = outerHeight - baseThickness;
    } else {
      baseThickness = outerHeight - innerHeight;
    }

    const hasInnerWidth = innerWidth !== null;
    const hasOuterWidth = outerWidth !== null;
    const hasWidthMultiple = widthMultiple !== null;

    const hasInnerDepth = innerDepth !== null;
    const hasOuterDepth = outerDepth !== null;
    const hasDepthMultiple = depthMultiple !== null;

    { // width validation
      if (wallThicknessX <= 0) {
        throw Error('"wallThicknessX" must be greater than or equal to 0')
      }

      if (!hasInnerWidth && !hasOuterWidth  && !hasWidthMultiple) {
        throw Error('at least one of "innerWidth", "outerWidth", "widthMultiple" must be provided');
      }

      if (hasInnerWidth && !hasOuterWidth && !hasWidthMultiple && expandStrategyX !== ExpandStrategy.none) {
        throw Error('"expandStrategyX" must be "none" when only "innerWidth" is provided');
      }

      if (hasOuterWidth && hasWidthMultiple && !_.isInteger(outerWidth / widthMultiple)) {
        throw Error('"outerWidth" is not a multiple of "widthMultiple');
      }

      if (!hasInnerWidth && (hasOuterWidth || hasWidthMultiple) && expandStrategyX !== ExpandStrategy.inside) {
        throw Error('"expandStrategyX" must be "inside" when "innerWidth" is not provided');
      }

      if (hasInnerWidth && hasOuterWidth && expandStrategyX === ExpandStrategy.none) {
        const computedOuterWidth = (innerWidth + 2 * wallThicknessX);
        if (computedOuterWidth !== outerWidth) {
          throw Error('invalid "innerWidth", "wallThicknessX", "outerWidth" combination for "expandStrategyX" set to "none". Either change "expandStrategyX" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }

      if (hasInnerWidth && !hasOuterWidth && hasWidthMultiple && expandStrategyX === ExpandStrategy.none) {
        const providedWidth = innerWidth + 2 * wallThicknessX;
        if(providedWidth !== getNextMultiple(providedWidth, widthMultiple)) {
          throw Error('invalid "innerWidth", "wallThicknessX", "widthMultiple" combination for "expandStrategyX" set to "none". Either change "expandStrategyX" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }
    }

    { // depth validation
      if (wallThicknessY <= 0) {
        throw Error('"wallThicknessY" must be greater than or equal to 0')
      }

      if (!hasInnerDepth && !hasOuterDepth  && !hasDepthMultiple) {
        throw Error('at least one of "innerDepth", "outerDepth", "depthMultiple" must be provided');
      }

      if (hasInnerDepth && !hasOuterDepth && !hasDepthMultiple && expandStrategyX !== ExpandStrategy.none) {
        throw Error('"expandStrategyY" must be "none" when only "innerDepth" is provided');
      }

      if (hasOuterDepth && hasDepthMultiple && !_.isInteger(outerDepth / depthMultiple)) {
        throw Error('"outerDepth" is not a multiple of "depthMultiple');
      }

      if (!hasInnerDepth && (hasOuterDepth || hasDepthMultiple) && expandStrategyY !== ExpandStrategy.inside) {
        throw Error('"expandStrategyY" must be "inside" when "innerDepth" is not provided');
      }

      if (hasInnerDepth && hasOuterDepth && expandStrategyY === ExpandStrategy.none) {
        const computedOuterDepth = innerDepth + 2 * wallThicknessY;
        if (computedOuterDepth !== outerDepth) {
          throw Error('invalid "innerDepth", "wallThicknessY", "outerDepth" combination for "expandStrategyY" set to "none". Either change "expandStrategyY" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }

      if (hasInnerDepth && !hasOuterDepth && hasDepthMultiple && expandStrategyY === ExpandStrategy.none) {
        const providedDepth = innerDepth + 2 * wallThicknessY;
        if(providedDepth !== getNextMultiple(providedDepth, depthMultiple)) {
          throw Error('invalid "innerDepth", "wallThicknessY", "depthMultiple" combination for "expandStrategyY" set to "none". Either change "expandStrategyY" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }
    }

    // width initialization
    if (!hasInnerWidth) {
      innerWidth = 0; // default width for expansion
    }

    if (!hasOuterWidth) {
      const computedWidth = innerWidth + 2 * wallThicknessX;

      outerWidth = hasWidthMultiple
        ? getNextMultiple(computedWidth, widthMultiple)
        : computedWidth;
    }

    if (expandStrategyX === ExpandStrategy.inside) {
      innerWidth = outerWidth - 2 * wallThicknessX;
    } else if (expandStrategyX === ExpandStrategy.wall) {
      wallThicknessX = (outerWidth - innerWidth) / 2;
    }

    // depth initialization
    if (!hasInnerDepth) {
      innerDepth = 0; // default depth for expansion
    }

    if (!hasOuterDepth) {
      const computedDepth = innerDepth + 2 * wallThicknessY;

      outerDepth = hasDepthMultiple
        ? getNextMultiple(computedDepth, depthMultiple)
        : computedDepth;
    }

    if (expandStrategyY === ExpandStrategy.inside) {
      innerDepth = outerDepth - 2 * wallThicknessY;
    } else if (expandStrategyY === ExpandStrategy.wall) {
      wallThicknessY = (outerDepth - innerDepth) / 2;
    }

    // base support x initialization
    if (baseSupportLengthX !== Infinity) {
      baseHoleWidth = innerWidth - 2 * baseSupportLengthX;

      if (baseHoleWidth < 0) {
        throw Error('"baseSupportLengthX" is too big')
      }
    }

    // base support y initialization
    if (baseSupportLengthY !== Infinity) {
      baseHoleDepth = innerDepth - 2 * baseSupportLengthY;

      if (baseHoleDepth < 0) {
        throw Error('"baseSupportLengthY" is too big')
      }
    }

    // brace validation
    if (braceLengthX !== Infinity && braceLengthY !== Infinity && braceHeight === Infinity) {
      throw Error('"braceHeight" must be provided when "braceLengthX" and/or "braceLengthY" is provided')
    }

    super({
      name,
      wrapper: new RectPrism({
        name: 'Outer Box',
        isOptional,
        width: outerWidth,
        depth: outerDepth,
        height: outerHeight,
      })
        .difference(
          new RectPrism({
            name: 'Inner Hole',
            isOptional,
            width: innerWidth,
            depth: innerDepth,
            height: innerHeight,
          })
            .translate(wallThicknessX, wallThicknessY, baseThickness),
          new RectPrism({
            name: 'Base Hole',
            isOptional: true,
            width: baseHoleWidth,
            depth: baseHoleDepth,
            height: baseThickness,
          })
            .translateXY((outerWidth / 2) - (baseHoleWidth / 2), (outerDepth / 2) - (baseHoleDepth / 2)),
          new RectPrism({
            name: 'Left/Right Wall Holes',
            isOptional: true,
            width: outerWidth,
            depth: innerDepth - 2 * braceLengthY,
            height: outerHeight - braceHeight - baseThickness,
          })
            .translateYZ(wallThicknessY + braceLengthY, baseThickness + braceHeight),
          new RectPrism({
            name: 'Front/Back Wall Holes',
            isOptional: true,
            width: innerWidth - 2 * braceLengthX,
            depth: outerDepth,
            height: outerHeight - braceHeight - baseThickness,
          })
            .translateXZ(wallThicknessX + braceLengthX, baseThickness + braceHeight)
        )
    });

    this.innerWidth = innerWidth;
    this.innerDepth = innerDepth;
    this.outerWidth = outerWidth;
    this.outerDepth = outerDepth;
    this.widthMultiple = widthMultiple;
    this.depthMultiple = depthMultiple;
    this.wallThicknessX = wallThicknessX;
    this.wallThicknessY = wallThicknessY;
    this.expandStrategyX = expandStrategyX;
    this.expandStrategyY = expandStrategyY;
    this.baseHoleWidth = baseHoleWidth;
    this.baseHoleDepth = baseHoleDepth;
    this.baseSupportLengthX = baseSupportLengthX;
    this.baseSupportLengthY = baseSupportLengthY;
    this.braceLengthX = braceLengthX;
    this.braceLengthY = braceLengthY;
    this.braceHeight = braceHeight;
    this.baseThickness = baseThickness;
    this.innerHeight = innerHeight;
    this.outerHeight = outerHeight;
  }

  log() {
    return super.log({
      innerWidth: this.innerWidth,
      innerDepth: this.innerDepth,
      outerWidth: this.outerWidth,
      outerDepth: this.outerDepth,
      widthMultiple: this.widthMultiple,
      depthMultiple: this.depthMultiple,
      wallThicknessX: this.wallThicknessX,
      wallThicknessY: this.wallThicknessY,
      expandStrategyX: this.expandStrategyX,
      expandStrategyY: this.expandStrategyY,
      baseHoleWidth: this.baseHoleWidth,
      baseHoleDepth: this.baseHoleDepth,
      baseSupportLengthX: this.baseSupportLengthX,
      baseSupportLengthY: this.baseSupportLengthY,
      braceLengthX: this.braceLengthX,
      braceLengthY: this.braceLengthY,
      braceHeight: this.braceHeight,
      baseThickness: this.baseThickness,
      innerHeight: this.innerHeight,
      outerHeight: this.outerHeight,
    })
  }
}
