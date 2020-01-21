module.exports = {
  globals: [
    'cube',
    'difference',
  ].reduce(
    (globals, keyword) => {
      globals[keyword] = 'readonly'; // eslint-disable-line no-param-reassign
      return globals;
    },
    {},
  ),
};
