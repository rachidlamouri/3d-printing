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
  });
});
