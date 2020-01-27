const { expect } = require('chai');
const { makeContainer } = require('../src/makeContainer');

describe('makeContainer', function () {
  describe('parameter validation', function () {
    const itThrowsAnError = (parameterName, statement, testValue) => {
      it('throws an error', function () {
        const testFn = () => {
          makeContainer({ [parameterName]: testValue });
        };

        expect(testFn).to.throw(`${parameterName} ${statement}`);
      });
    };

    context('with extra parameters', function () {
      it('throws an error', function () {
        const testFn = () => {
          makeContainer({ extra1: 2, extra2: 'a' });
        };

        expect(testFn).to.throw('Unexpected extra parameter(s) [extra1,extra2]');
      });
    });

    [
      'innerWidth',
      'innerDepth',
      'outerHeight',
      'sideLengthMultiple',
      'minBottomHoleSideLength',
      'bottomClearance',
    ].forEach((parameterName) => {
      context(`when "${parameterName}" is not an integer`, function () {
        itThrowsAnError(parameterName, 'must be an integer', 0.1);
      });
    });

    [
      'innerWidth',
      'innerDepth',
      'outerHeight',
      'sideLengthMultiple',
      'minWallThickness',
      'bottomThickness',
      'bottomClearance',
    ].forEach((parameterName) => {
      context(`when "${parameterName}" is zero`, function () {
        itThrowsAnError(parameterName, 'must be greater than zero', 0);
      });
    });

    [
      'innerWidth',
      'innerDepth',
      'outerHeight',
      'sideLengthMultiple',
      'minWallThickness',
      'bottomThickness',
      'bottomClearance',
    ].forEach((parameterName) => {
      context(`when "${parameterName}" is negative`, function () {
        itThrowsAnError(parameterName, 'must be greater than zero', -1);
      });
    });

    [
      'minBottomHoleSideLength',
    ].forEach((parameterName) => {
      context(`when "${parameterName}" is negative`, function () {
        itThrowsAnError(parameterName, 'must be greater than or equal to zero', -1);
      });
    });
  });

  context('by default', function () {
    it('returns container meta', function () {
      const {
        container,
        ...meta
      } = makeContainer();

      expect(container).to.be.an.instanceof(OpenJscadObject);
      expect(meta).to.eql({
        innerBoxSize: [
          20,
          20,
          19,
        ],
        outerBoxSize: [
          24,
          24,
          20,
        ],
        wallThicknessSize: [
          2,
          2,
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

  context('when the bottomClearance is Infinity and the minBottomHoleSideLength is zero', function () {
    it('does not make a bottom hole', function () {
      const { bottomHoleSize } = makeContainer({
        bottomClearance: Infinity,
        minBottomHoleSideLength: 0,
      });
      expect(bottomHoleSize).to.eql([
        0,
        0,
        1,
      ]);
    });
  });
});
