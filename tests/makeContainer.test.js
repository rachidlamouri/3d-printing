const { expect } = require('chai');
const { makeContainer } = require('../src/makeContainer');
const {
  buildBehaviorsForFunction,
  buildTheyMustBeSomethingForContextTuples,
  itThrowsAnErrorWhenCalledWithExtraParameters,
} = require('./helpers/behaviors');

const {
  theyMustBePositiveIntegers,
  theyMustBePositiveNumbers,
  theyMustBeNonNegativeIntegers,
  theyMustBeValidInnerDimensions,
} = buildBehaviorsForFunction(makeContainer, {
  theyMustBeValidInnerDimensionsForItThrowsAnError: buildTheyMustBeSomethingForContextTuples(
    ['equal to minBottomHoleSideLength', 'must be greater than ref:minBottomHoleSideLength', 1, { minBottomHoleSideLength: 1 }],
    ['less than minBottomHoleSideLength', 'must be greater than ref:minBottomHoleSideLength', 1, { minBottomHoleSideLength: 2 }],
    ['the decimal precision is greater than 1', 'must have no more than 1 decimal places', 1.23, { minBottomHoleSideLength: 1 }],
  ),
});

describe('makeContainer', function () {
  describe('parameter validation', function () {
    itThrowsAnErrorWhenCalledWithExtraParameters(makeContainer);

    theyMustBeValidInnerDimensions(
      'innerWidth',
      'innerDepth',
    );

    theyMustBePositiveIntegers(
      'outerHeight',
      'sideLengthMultiple',
    );

    theyMustBePositiveNumbers(
      'minWallThickness',
      'wallThickness',
      'bottomThickness',
    );

    theyMustBeNonNegativeIntegers(
      'minBottomHoleSideLength',
      'bottomClearance',
      'baseClearance',
      'xClearance',
      'yClearance',
    );
  });

  context('by default', function () {
    before(function () {
      this.containerMeta = makeContainer();
    });

    it('returns container meta', function () {
      expect(this.containerMeta).to.be.an('object')
        .that.includes.keys([
          'container',
          'debug',
        ]);
    });

    it('returns the container', function () {
      expect(this.containerMeta.container).to.be.an.instanceof(OpenJscadObject);
    });

    it('returns debug information', function () {
      expect(this.containerMeta.debug).to.eql({
        innerBoxSize: [
          20,
          20,
          19,
        ],
        outerBoxSize: [
          22,
          22,
          20,
        ],
        wallThicknessSizes: [
          1,
          1,
          1,
        ],
        bottomHoleSize: [
          5,
          5,
          1,
        ],
        xHoleSize: null,
        xHolePosition: null,
        yHoleSize: null,
        yHolePosition: null,
      });
    });
  });

  context('when the sideLengthMultiple and minWallThickness are set', function () {
    it('adjusts the wall thicknesses to respect the sideLengthMultiple', function () {
      const { wallThicknessSizes } = makeContainer({
        innerWidth: 11,
        innerDepth: 11,
        sideLengthMultiple: 2,
        minWallThickness: 1,
      }).debug;

      expect(wallThicknessSizes).to.eql([
        1.5,
        1.5,
        1,
      ]);
    });
  });

  context('when wallThickness is set', function () {
    before(function () {
      this.debug = makeContainer({
        innerWidth: 11,
        innerDepth: 11,
        outerHeight: 10,
        bottomThickness: 1,
        bottomClearance: 1,
        sideLengthMultiple: 2,
        minWallThickness: 1,
        wallThickness: 1,
      }).debug;
    });

    it('respects the wallThickness', function () {
      expect(this.debug.wallThicknessSizes).to.eql([
        1,
        1,
        1,
      ]);
    });

    it('adjusts the inner dimensions to respect the sideLengthMultiple', function () {
      expect(this.debug.innerBoxSize).to.eql([
        12,
        12,
        9,
      ]);
    });

    it('adjusts the bottom hole dimensions based on the new inner dimensions', function () {
      expect(this.debug.bottomHoleSize).to.eql([
        10,
        10,
        1,
      ]);
    });
  });

  context('when the bottomClearance is Infinity and the minBottomHoleSideLength is zero', function () {
    it('does not make a bottom hole', function () {
      const { bottomHoleSize } = makeContainer({
        bottomClearance: Infinity,
        minBottomHoleSideLength: 0,
      }).debug;
      expect(bottomHoleSize).to.eql([
        0,
        0,
        1,
      ]);
    });
  });

  context('when sideLengthMultiple is null', function () {
    context('and the wallThickness is not set', function () {
      it('uses the minWallThickness to calculate the outer dimensions', function () {
        const { outerBoxSize } = makeContainer({
          innerWidth: 11,
          innerDepth: 7,
          outerHeight: 10,
          minWallThickness: 5,
          sideLengthMultiple: null,
        }).debug;

        expect(outerBoxSize).to.eql([
          21,
          17,
          10,
        ]);
      });
    });

    context('and the wallThickness is set', function () {
      it('does not enforce a side length multiple', function () {
        const { outerBoxSize } = makeContainer({
          innerWidth: 11,
          innerDepth: 7,
          outerHeight: 10,
          minWallThickness: 5,
          wallThickness: 3,
          sideLengthMultiple: null,
        }).debug;

        expect(outerBoxSize).to.eql([
          17,
          13,
          10,
        ]);
      });
    });
  });

  context('when ignoreDecimalPrecision is true', function () {
    it('does not throw an error for excessive decimals', function () {
      const testFn1 = () => {
        makeContainer({ innerWidth: 20.33333333 });
      };
      const testFn2 = () => {
        makeContainer({ innerWidth: 20.33333333, ignoreDecimalPrecision: true });
      };

      expect(testFn1).to.throw(/must have no more than 1 decimal places/);
      expect(testFn2).to.not.throw();
    });
  });

  context('with baseClearance, xClearance and yClearance', function () {
    before(function () {
      this.debug = makeContainer({
        innerWidth: 40,
        innerDepth: 32,
        outerHeight: 50,
        bottomThickness: 1.5,
        wallThickness: 2,
        baseClearance: 5,
        xClearance: 3,
        yClearance: 7,
      }).debug;
    });

    it('makes a hole in the walls that run in the x direction', function () {
      expect(this.debug.xHoleSize).to.eql([
        34,
        36,
        50,
      ]);

      expect(this.debug.xHolePosition).to.eql([
        5,
        0,
        6.5,
      ]);
    });

    it('makes a hole in walls that run in the y direction', function () {
      expect(this.debug.yHoleSize).to.eql([
        44,
        18,
        50,
      ]);

      expect(this.debug.yHolePosition).to.eql([
        0,
        9,
        6.5,
      ]);
    });
  });
});
