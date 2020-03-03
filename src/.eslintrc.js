module.exports = {
  globals: [
    'cube',
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
