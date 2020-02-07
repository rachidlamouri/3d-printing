module.exports = {
  globals: [
    'cube',
    'difference',
    'union',
  ].reduce(
    (globals, keyword) => {
      globals[keyword] = 'readonly'; // eslint-disable-line no-param-reassign
      return globals;
    },
    {},
  ),
};
