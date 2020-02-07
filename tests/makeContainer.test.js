const { expect } = require('chai');
const { makeContainer } = require('../src/makeContainer');
const {
  buildBehaviorsFor,
  itThrowsAnErrorWhenCalledWithExtraParameters,
} = require('./helpers/behaviors');

const {
  theyMustBeIntegers,
  theyMustBeGreaterThanZero,
  theyMustBeGreaterThanOrEqualToZero,
} = buildBehaviorsFor(makeContainer);

describe('makeContainer', function () {
  describe('parameter validation', function () {
    const theyMustBeGreatThanMinBottomHoleSideLength = (...parameterNames) => {
      parameterNames.forEach((parameterName) => {
        context(`when "${parameterName}" is equal to minBottomHoleSideLength`, function () {
          it('throws an error', function () {
            const testFn = () => {
              makeContainer({
                [parameterName]: 1,
                minBottomHoleSideLength: 2,
              });
            };

            expect(testFn).to.throw(`${parameterName} must be greater than minBottomHoleSideLength`);
          });
        });

        context(`when "${parameterName}" is less than minBottomHoleSideLength`, function () {
          it('throws an error', function () {
            const testFn = () => {
              makeContainer({
                [parameterName]: 1,
                minBottomHoleSideLength: 1,
              });
            };

            expect(testFn).to.throw(`${parameterName} must be greater than minBottomHoleSideLength`);
          });
        });
      });
    };

    itThrowsAnErrorWhenCalledWithExtraParameters(makeContainer);

    theyMustBeIntegers(
      'innerWidth',
      'innerDepth',
      'outerHeight',
      'sideLengthMultiple',
      'minBottomHoleSideLength',
      'bottomClearance',
    );

    theyMustBeGreaterThanZero(
      'innerWidth',
      'innerDepth',
      'outerHeight',
      'sideLengthMultiple',
      'minWallThickness',
      'bottomThickness',
      'bottomClearance',
    );

    theyMustBeGreaterThanOrEqualToZero(
      'minBottomHoleSideLength',
    );

    theyMustBeGreatThanMinBottomHoleSideLength(
      'innerWidth',
      'innerDepth',
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
});
