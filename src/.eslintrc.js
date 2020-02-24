module.exports = {
  globals: [
    'cube',
    'difference',
    'intersection',
    'union',
  ].reduce(
    (globals, keyword) => {
      globals[keyword] = 'readonly'; // eslint-disable-line no-param-reassign
      return globals;
    },
    {},
  ),
};
