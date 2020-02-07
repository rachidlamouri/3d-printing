const _ = require('lodash');

const buildIsGreaterThanN = (n) => (value) => value > n;
const isIntegerRule = [_.isInteger, 'must be an integer'];
const isPositiveRule = [(value) => value > 0, 'must be greater than zero'];
const isNonNegativeRule = [(value) => value >= 0, 'must be greater than or equal to zero'];

const isPositiveRuleSet = [isPositiveRule];
const isPositiveIntegerRuleSet = [
  isIntegerRule,
  isPositiveRule,
];
const isNonNegativeIntegerRuleSet = [
  isIntegerRule,
  isNonNegativeRule,
];

const validateParameters = (parameters, extraParameters, keyedRuleSets) => {
  if (!_.isEmpty(extraParameters)) {
    throw new Error(`Unexpected extra parameter(s) [${_.keys(extraParameters).join(',')}]`);
  }

  _.forEach(keyedRuleSets, (ruleSet, parameterName) => {
    ruleSet.forEach(([test, rule]) => {
      if (!test(parameters[parameterName])) {
        throw new Error(`${parameterName} ${rule}`);
      }
    });
  });
};

module.exports = {
  buildIsGreaterThanN,
  isIntegerRule,
  isPositiveRule,
  isNonNegativeRule,
  isPositiveRuleSet,
  isPositiveIntegerRuleSet,
  isNonNegativeIntegerRuleSet,
  validateParameters,
};
