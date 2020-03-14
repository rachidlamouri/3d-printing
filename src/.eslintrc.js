module.exports = {
  globals: [
    'cube',
    'cylinder',
    'difference',
    'intersection',
    'logger',
    'union',
  ].reduce(
    (globals, keyword) => {
      globals[keyword] = 'readonly'; // eslint-disable-line no-param-reassign
      return globals;
    },
    {},
  ),
};
