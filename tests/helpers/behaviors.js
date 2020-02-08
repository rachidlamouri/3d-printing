const _ = require('lodash');
const { expect } = require('chai');

const buildItThrowsAnErrorForFunction = (fn) => (parameterName, assertionErrorStatement, badTestValue, otherParameters = {}) => {
  it('throws an error', function () {
    const testFn = () => {
      fn({
        [parameterName]: badTestValue,
        ...otherParameters,
      });
    };

    expect(testFn).to.throw(`"${parameterName}" ${assertionErrorStatement}`);
  });
};

const buildTheyMustBeSomethingForContextTuples = (...contextTuples) => (itThrowsAnErrorForParameters) => (...parameterNames) => {
  parameterNames.forEach((parameterName) => {
    describe(parameterName, function () {
      contextTuples.forEach(([contextStatement, assertionErrorStatement, badTestValue, otherParameters]) => {
        context(`when ${contextStatement}`, function () {
          itThrowsAnErrorForParameters(parameterName, assertionErrorStatement, badTestValue, otherParameters);
        });
      });
    });
  });
};

const whenNegativeContextTuple = (assertionErrorStatement = 'must be a positive number') => ['negative', assertionErrorStatement, -1];
const whenZeroContextTuple = ['zero', 'must be a positive number', 0];
const whenNotAnIntegerContextTuple = ['not an integer', 'must be an integer', 0.1];

const buildTheyMustBePositiveIntegersForItThrowsAnError = buildTheyMustBeSomethingForContextTuples(
  whenNegativeContextTuple(),
  whenZeroContextTuple,
  whenNotAnIntegerContextTuple,
);

const buildTheyMustBePositiveNumbersForItThrowsAnError = buildTheyMustBeSomethingForContextTuples(
  whenNegativeContextTuple(),
  whenZeroContextTuple,
);

const buildTheyMustBeNonNegativeIntegersForItThrowsAnError = buildTheyMustBeSomethingForContextTuples(
  whenNegativeContextTuple('must be larger than or equal to 0'),
  whenNotAnIntegerContextTuple,
);

const buildBehaviorsForFunction = (fn, customBehaviors = {}) => {
  const itThrowsAnErrorForParameters = buildItThrowsAnErrorForFunction(fn);

  return _.reduce(
    {
      buildTheyMustBePositiveIntegersForItThrowsAnError,
      buildTheyMustBePositiveNumbersForItThrowsAnError,
      buildTheyMustBeNonNegativeIntegersForItThrowsAnError,
      ...customBehaviors,
    },
    (behaviors, buildTheyMustBeSomethingForItThrowsAnError, functionName) => {
      const behaviorName = _.lowerFirst(
        functionName
          .replace(/build/g, '')
          .replace(/ForItThrowsAnError/g, ''),
      );

      // eslint-disable-next-line no-param-reassign
      behaviors[behaviorName] = buildTheyMustBeSomethingForItThrowsAnError(itThrowsAnErrorForParameters);
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

      expect(testFn).to.throw(/"extra1" is not allowed/);
      expect(testFn).to.throw(/"extra2" is not allowed/);
    });
  });
};

module.exports = {
  buildBehaviorsForFunction,
  buildTheyMustBeSomethingForContextTuples,
  itThrowsAnErrorWhenCalledWithExtraParameters,
};
