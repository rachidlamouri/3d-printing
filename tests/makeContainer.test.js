const { expect } = require('chai');
const { makeContainer } = require('../src/makeContainer');

describe('makeContainer', function () {
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
});
