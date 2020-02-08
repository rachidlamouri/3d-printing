const Joi = require('@hapi/joi');

const positiveInteger = () => Joi.number().integer().positive();
const positiveNumber = () => Joi.number().positive();
const nonNegativeInteger = () => Joi.number().integer().min(0);
const boolean = () => Joi.boolean();

const [
  requiredPositiveInteger,
  requiredPositiveNumber,
  requiredNonNegativeInteger,
  requiredBoolean,
] = [
  positiveInteger,
  positiveNumber,
  nonNegativeInteger,
  boolean,
].map((generateSchema) => () => generateSchema().required());

const validateParameters = (parameters = {}, extraParameters = {}, parametersPropertySchemas = {}) => {
  Joi.assert(
    { ...parameters, ...extraParameters },
    Joi.object(parametersPropertySchemas),
    { abortEarly: false },
  );
};

module.exports = {
  requiredPositiveInteger,
  requiredPositiveNumber,
  requiredNonNegativeInteger,
  requiredBoolean,
  validateParameters,
};
