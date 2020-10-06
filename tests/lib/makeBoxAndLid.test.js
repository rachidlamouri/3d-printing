const { csg: { CSG } } = require('@jscad/csg/api');
const { expect } = require('chai');
const { makeBoxAndLid } = require('../../src/lib/makeBoxAndLid');

describe('lib/makeBoxAndLid', function () {
  it('returns a csg with the box and lid side to side', function () {
    expect(makeBoxAndLid().sideBySide).to.be.instanceOf(CSG);
  });

  it('returns a csg with the box and lid front to back', function () {
    expect(makeBoxAndLid().frontToBack).to.be.instanceOf(CSG);
  });
});
