import _ from 'lodash';
import { getNextMultiple } from '../typedUtils';
import { CsgWrapper } from '../csgWrappers';
import { Container, ExpandStrategy, ContainerOptions } from './container';
export interface RepeatContainerOptions extends ContainerOptions {
  containerCount?: number,
  containerCountX?: number,
  containerCountY?: number,
}

export class RepeatContainer extends CsgWrapper {
  constructor ({
    name,
    containerCount = 1,
    containerCountX = containerCount,
    containerCountY = containerCount,
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
  }: RepeatContainerOptions) {
    if (containerCountX < 2 && containerCountY < 2) {
      throw Error('One or both of "containerCntX" and "containerCountY" must be greater than or equal to 2');
    }

    const heightParameterCount = _.sumBy(
      [outerHeight, innerHeight, baseThickness],
      (value: number) => value === null ? 0 : 1,
    );

    if (heightParameterCount !== 2) {
      throw Error('Must provide exactly two of "outerHeight", "innerHeight", "baseThickness"');
    } else if (outerHeight === null) {
      outerHeight = innerHeight + baseThickness;
    } else if (innerHeight === null) {
      innerHeight = outerHeight - baseThickness;
    } else {
      baseThickness = outerHeight - innerHeight;
    }

    const wallCountX = containerCountX + 1;
    const wallCountY = containerCountY + 1;

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
        const computedOuterWidth = containerCountX * innerWidth + wallCountX * wallThicknessX
        if (computedOuterWidth !== outerWidth) {
          throw Error('invalid "containerCountX", "innerWidth", "wallThicknessX", "outerWidth" combination for "expandStrategyX" set to "none". Either change "expandStrategyX" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }

      if (hasInnerWidth && !hasOuterWidth && hasWidthMultiple && expandStrategyX === ExpandStrategy.none) {
        const providedWidth = containerCountX * innerWidth + wallCountX * wallThicknessX
        if(providedWidth !== getNextMultiple(providedWidth, widthMultiple)) {
          throw Error('invalid "containerCountX", "innerWidth", "wallThicknessX", "widthMultiple" combination for "expandStrategyX" set to "none". Either change "expandStrategyX" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
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

      if (hasInnerDepth && !hasOuterDepth && !hasDepthMultiple && expandStrategyY !== ExpandStrategy.none) {
        throw Error('"expandStrategyY" must be "none" when only "innerDepth" is provided');
      }

      if (hasOuterDepth && hasDepthMultiple && !_.isInteger(outerDepth / depthMultiple)) {
        throw Error('"outerDepth" is not a multiple of "depthMultiple');
      }

      if (!hasInnerDepth && (hasOuterDepth || hasDepthMultiple) && expandStrategyY !== ExpandStrategy.inside) {
        throw Error('"expandStrategyY" must be "inside" when "innerDepth" is not provided');
      }

      if (hasInnerDepth && hasOuterDepth && expandStrategyY === ExpandStrategy.none) {
        const computedOuterDepth = containerCountY * innerDepth + wallCountY * wallThicknessY
        if (computedOuterDepth !== outerDepth) {
          throw Error('invalid "containerCountY", "innerDepth", "wallThicknessY", "outerDepth" combination for "expandStrategyY" set to "none". Either change "expandStrategyY" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }

      if (hasInnerDepth && !hasOuterDepth && hasDepthMultiple && expandStrategyY === ExpandStrategy.none) {
        const providedDepth = containerCountY * innerDepth + wallCountY * wallThicknessY
        if(providedDepth !== getNextMultiple(providedDepth, depthMultiple)) {
          throw Error('invalid "containerCountY", "innerDepth", "wallThicknessY", "depthMultiple" combination for "expandStrategyY" set to "none". Either change "expandStrategyY" to "wall" or "inside", provide less dimensions, or provide exact dimensions');
        }
      }
    }

    // width initialization
    if (!hasInnerWidth) {
      innerWidth = 0; // default width for expansion
    }

    if (!hasOuterWidth) {
      const computedWidth = containerCountX * innerWidth + wallCountX * wallThicknessX;

      outerWidth = hasWidthMultiple
        ? getNextMultiple(computedWidth, widthMultiple)
        : computedWidth;
    }

    if (expandStrategyX === ExpandStrategy.inside) {
      innerWidth = (outerWidth - wallCountX * wallThicknessX) / containerCountX;
    } else if (expandStrategyX === ExpandStrategy.wall) {
      wallThicknessX = (outerWidth - containerCountX * innerWidth) / wallCountX;
    }

    // depth initialization
    if (!hasInnerDepth) {
      innerDepth = 0; // default depth for expansion
    }

    if (!hasOuterDepth) {
      const computedDepth = containerCountY * innerDepth + wallCountY * wallThicknessY;

      outerDepth = hasDepthMultiple
        ? getNextMultiple(computedDepth, depthMultiple)
        : computedDepth;
    }

    if (expandStrategyY === ExpandStrategy.inside) {
      innerDepth = (outerDepth - wallCountY * wallThicknessY) / containerCountY;
    } else if (expandStrategyY === ExpandStrategy.wall) {
      wallThicknessY = (outerDepth - containerCountY * innerDepth) / wallCountY;
    }

    const indices = _.range(containerCountX)
      .map((xIndex) => (
        _.range(containerCountY)
          .map((yIndex) => [xIndex, yIndex])
      ))
      .flat();

    super({
      name,
      csg: CsgWrapper.union(
        ...indices.map(([xIndex, yIndex]) => (
          new Container({
            innerWidth,
            innerDepth,
            wallThicknessX,
            wallThicknessY,
            expandStrategyX: ExpandStrategy.none,
            expandStrategyY: ExpandStrategy.none,
            baseHoleLength,
            baseHoleWidth,
            baseHoleDepth,
            baseSupportLengthX,
            baseSupportLengthY,
            braceHeight,
            braceLengthX,
            braceLengthY,
            baseThickness,
            innerHeight,
            outerHeight,
          })
            .translateX(xIndex * innerWidth + xIndex * wallThicknessX)
            .translateY(yIndex * innerDepth + yIndex * wallThicknessY)
        )),
      ),
    });
  }
}
