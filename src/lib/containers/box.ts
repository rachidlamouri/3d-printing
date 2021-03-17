import _ from 'lodash';
import { CsgWrapper } from '../csgWrappers';
import {
  Container,
  ExpandStrategy,
} from './container';
import { getNextMultiple } from '../typedUtils';

export interface BoxOptions {
  lidSupportHeight?: number;
  lidSupportHeightFraction?: number;
  lidHeight?: number;
  lidHeightFraction?: number;
  lidAllowance?: number;
  lidAllowanceX?: number;
  lidAllowanceY?: number;
  lidAllowanceZ?: number;
  name?: string,
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
  baseThickness?: number,
  innerHeight?: number,
  outerHeight?: number,
}

export class Box {
  container: CsgWrapper;
  lid: Container;
  sideBySideX: CsgWrapper;
  sideBySideY: CsgWrapper;

  constructor({
    lidSupportHeight = null,
    lidSupportHeightFraction = null,
    lidHeight = null,
    lidHeightFraction = null,
    lidAllowance = null,
    lidAllowanceX = lidAllowance,
    lidAllowanceY = lidAllowance,
    lidAllowanceZ = lidAllowance,
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
    baseThickness = null,
    innerHeight = null,
    outerHeight = null,
  }: BoxOptions) {
    if (!lidAllowanceX || !lidAllowanceY || !lidAllowanceZ) {
      throw Error('"lidAllowanceX", "lidAllowanceY", and "lidAllowanceZ" are required')
    }

    const hasBaseThickness = baseThickness !== null;
    const hasInnerHeight = innerHeight !== null;
    const hasOuterHeight = outerHeight !== null;

    if (hasOuterHeight && hasInnerHeight && hasBaseThickness && 2 * baseThickness + innerHeight !== outerHeight) {
      throw Error('Invalid "baseThickness", "innerHeight", "outerHeight". Either provide less dimensions, or provide exact dimensions');
    } else if ((!hasBaseThickness && !hasInnerHeight) || (!hasBaseThickness && !hasOuterHeight) || (!hasInnerHeight && !hasOuterHeight)) {
      throw Error('Must provide at least two of "outerHeight", "innerHeight", "baseThickness"');
    } else if (!hasOuterHeight) {
      outerHeight = innerHeight + 2 * baseThickness;
    } else if (!hasInnerHeight) {
      innerHeight = outerHeight - 2 * baseThickness;
    } else {
      baseThickness = (outerHeight - innerHeight) / 2;
    }

    const hasLidSupportHeight = lidSupportHeight !== null;
    const hasLidSupportHeightFraction = lidSupportHeightFraction !== null;
    const hasLidHeight = lidHeight !== null;
    const hasLidHeightFraction = lidHeightFraction !== null;

    const lidHeightParameterCount = _.sumBy(
      [hasLidSupportHeight, hasLidSupportHeightFraction, hasLidHeight, hasLidHeightFraction],
      (value: boolean) => value ? 1 : 0,
    );

    if (lidHeightParameterCount !== 1) {
      throw Error('Must provide exactly one of "lidSupportHeight", "lidSupportHeightFraction", "lidHeight", "lidHeightFraction"');
    }

    if (hasLidSupportHeightFraction) {
      lidSupportHeight = lidSupportHeightFraction * outerHeight;
    }

    if (hasLidSupportHeight || hasLidSupportHeightFraction) {
      lidHeight = outerHeight - lidSupportHeight;
    }

    if (hasLidHeightFraction) {
      lidHeight = lidHeightFraction * outerHeight;
    }

    if (hasLidHeight || hasLidHeightFraction) {
      lidSupportHeight = outerHeight - lidHeight;
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
        const computedOuterWidth = (innerWidth + 4 * wallThicknessX);
        if (computedOuterWidth !== outerWidth) {
          throw Error('invalid "innerWidth", "wallThicknessX", "outerWidth" combination for "expandStrategyX" set to "none". Either change "expandStrategyX" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }

      if (hasInnerWidth && !hasOuterWidth && hasWidthMultiple && expandStrategyX === ExpandStrategy.none) {
        const providedWidth = innerWidth + 4 * wallThicknessX;
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
        const computedOuterDepth = innerDepth + 4 * wallThicknessY;
        if (computedOuterDepth !== outerDepth) {
          throw Error('invalid "innerDepth", "wallThicknessY", "outerDepth" combination for "expandStrategyY" set to "none". Either change "expandStrategyY" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }

      if (hasInnerDepth && !hasOuterDepth && hasDepthMultiple && expandStrategyY === ExpandStrategy.none) {
        const providedDepth = innerDepth + 4 * wallThicknessY;
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
      const computedWidth = innerWidth + 4 * wallThicknessX;

      outerWidth = hasWidthMultiple
        ? getNextMultiple(computedWidth, widthMultiple)
        : computedWidth;
    }

    if (expandStrategyX === ExpandStrategy.inside) {
      innerWidth = outerWidth - 4 * wallThicknessX;
    } else if (expandStrategyX === ExpandStrategy.wall) {
      wallThicknessX = (outerWidth - innerWidth) / 4;
    }

    // depth initialization
    if (!hasInnerDepth) {
      innerDepth = 0; // default depth for expansion
    }

    if (!hasOuterDepth) {
      const computedDepth = innerDepth + 4 * wallThicknessY;

      outerDepth = hasDepthMultiple
        ? getNextMultiple(computedDepth, depthMultiple)
        : computedDepth;
    }

    if (expandStrategyY === ExpandStrategy.inside) {
      innerDepth = outerDepth - 4 * wallThicknessY;
    } else if (expandStrategyY === ExpandStrategy.wall) {
      wallThicknessY = (outerDepth - innerDepth) / 4;
    }

    const containerInteriorOuterWidth = innerWidth + 2 * wallThicknessX ;
    const containerInteriorOuterDepth = innerDepth + 2 * wallThicknessY ;
    const adjustedContainerInteriorOuterWidth = containerInteriorOuterWidth - 2 * lidAllowanceX;
    const adjustedContainerInteriorOuterDepth = containerInteriorOuterDepth - 2 * lidAllowanceY;

    const lidSupportLengthX = wallThicknessX + lidAllowanceX;
    const lidSupportLengthY = wallThicknessY + lidAllowanceY;

    this.container = CsgWrapper.union(
      new Container({
        name: 'Container Interior',
        innerWidth: innerWidth - 2 * lidAllowanceX,
        innerDepth: innerDepth - 2 * lidAllowanceY,
        wallThicknessX,
        wallThicknessY,
        outerWidth: adjustedContainerInteriorOuterWidth,
        outerDepth: adjustedContainerInteriorOuterDepth,
        expandStrategy: ExpandStrategy.none,
        baseThickness,
        outerHeight: innerHeight + baseThickness - lidAllowanceZ,
      })
        .translateXY(lidSupportLengthX, lidSupportLengthY),
      new Container({
        name: 'Lid Support',
        isOptional: true,
        innerWidth: adjustedContainerInteriorOuterWidth,
        innerDepth: adjustedContainerInteriorOuterDepth,
        wallThicknessX: lidSupportLengthX,
        wallThicknessY: lidSupportLengthY,
        outerWidth,
        outerDepth,
        expandStrategy: ExpandStrategy.none,
        baseThickness: 0,
        outerHeight: lidSupportHeight,
      }),
    )

    this.lid = new Container({
      name: 'Lid',
      innerWidth: containerInteriorOuterWidth,
      innerDepth: containerInteriorOuterDepth,
      wallThicknessX,
      wallThicknessY,
      outerWidth,
      outerDepth,
      expandStrategy: ExpandStrategy.none,
      baseThickness,
      outerHeight: lidHeight,
    });

    this.sideBySideX = CsgWrapper.union(
      this.container,
      this.lid
        .copy()
        .translateX(outerWidth + 1),
    );

    this.sideBySideY = CsgWrapper.union(
      this.container,
      this.lid
        .copy()
        .translateY(outerDepth + 1),
    );
  }
}
