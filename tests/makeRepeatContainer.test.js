const { expect } = require('chai');
const { makeRepeatContainer } = require('../src/makeRepeatContainer');

const {
  itThrowsAnErrorWhenCalledWithExtraParameters,
} = require('./helpers/behaviors');

describe('makeRepeatContainer', function () {
  describe('parameter validation', function () {
    itThrowsAnErrorWhenCalledWithExtraParameters(makeRepeatContainer);
  });

  context('by default', function () {
    before(function () {
      this.containerMeta = makeRepeatContainer();
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
        startingOuterSize: [
          43,
          22,
          20,
        ],
        finalOuterSize: [
          43,
          22,
          20,
        ],
      });
    });
  });

  context('with decimal inner dimensions', function () {
    before(function () {
      this.debug = makeRepeatContainer({
        innerWidth: 6.7,
        innerDepth: 6.2,
        outerHeight: 10,
        count: 2,
      }).debug;
    });

    it('ignores the side length multiple for the starting outer size', function () {
      expect(this.debug.startingOuterSize).to.eql([
        16.4,
        8.2,
        10,
      ]);
    });
  });

  context('with sideLengthMultiple', function () {
    before(function () {
      this.debug = makeRepeatContainer({
        innerWidth: 6.7,
        innerDepth: 6.2,
        outerHeight: 12,
        sideLengthMultiple: 5,
        count: 2,
      }).debug;
    });

    it('ignores the sideLengthMultiple for the startingOuterSize', function () {
      expect(this.debug.startingOuterSize).to.eql([
        16.4,
        8.2,
        12,
      ]);
    });

    it('adjusts the outer dimensions to respect the sideLengthMultiple', function () {
      expect(this.debug.finalOuterSize).to.eql([
        20,
        15,
        12,
      ]);
    });
  });
});
