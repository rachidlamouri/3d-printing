const _ = require('lodash');
const { expect } = require('chai');

const buildItThrowsAnErrorFor = (fn) => (parameterName, statement, testValue) => {
  it('throws an error', function () {
    const testFn = () => {
      fn({ [parameterName]: testValue });
    };

    expect(testFn).to.throw(`${parameterName} ${statement}`);
  });
};

const buildTestBehavior = (
  contextStatement,
  assertionErrorStatement,
  badTestValue,
  itThrowsAnError,
) => (...parameterNames) => {
  parameterNames.forEach((parameterName) => {
    context(`when "${parameterName}" ${contextStatement}`, function () {
      itThrowsAnError(parameterName, assertionErrorStatement, badTestValue);
    });
  });
};

const buildTheyMustForContext = _.curry(buildTestBehavior);

const buildTheyMustBeIntegersForItThrowsAnError = buildTheyMustForContext('is not an integer', 'must be an integer', 0.1);
const buildTheyMustBeGreaterThanZeroForItThrowsAnError = (itThrowsAnError) => {
  const itMustBeGreaterThanZero = buildTestBehavior('is zero', 'must be greater than zero', 0, itThrowsAnError);
  const itMustBeGreaterThanZeroForNegative = buildTestBehavior('is negative', 'must be greater than zero', -1, itThrowsAnError);

  return (...parameterNames) => {
    parameterNames.forEach((parameterName) => {
      itMustBeGreaterThanZero(parameterName);
      itMustBeGreaterThanZeroForNegative(parameterName);
    });
  };
};
const buildTheyMustBeGreaterThanOrEqualToZeroForItThrowsAnError = buildTheyMustForContext('is negative', 'must be greater than or equal to zero', -1);

const buildBehaviorsFor = (fn) => {
  const itThrowsAnError = buildItThrowsAnErrorFor(fn);

  return _.reduce(
    {
      buildTheyMustBeIntegersForItThrowsAnError,
      buildTheyMustBeGreaterThanZeroForItThrowsAnError,
      buildTheyMustBeGreaterThanOrEqualToZeroForItThrowsAnError,
    },
    (behaviors, buildTheyMustBeSomethingForItThrowsAnError, functionName) => {
      const behaviorName = _.lowerFirst(
        functionName
          .replace(/build/g, '')
          .replace(/ForItThrowsAnError/g, ''),
      );

      // eslint-disable-next-line no-param-reassign
      behaviors[behaviorName] = buildTheyMustBeSomethingForItThrowsAnError(itThrowsAnError);
      return behaviors;
    },
    {},
  );
};

const itThrowsAnErrorWhenCalledWithExtraParameters = (fn) => {
  context('with extra parameters', function () {
    it('throws an error', function () {
      const testFn = () => {
        fn({ extra1: 2, extra2: 'a' });
      };

      expect(testFn).to.throw('Unexpected extra parameter(s) [extra1,extra2]');
    });
  });
};

module.exports = {
  buildBehaviorsFor,
  itThrowsAnErrorWhenCalledWithExtraParameters,
};
