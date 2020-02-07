class OpenJscadObject {
  translate() {
    return this;
  }
}

Object.assign(
  global,
  {
    OpenJscadObject,
    cube: () => new OpenJscadObject(),
    difference: () => new OpenJscadObject(),
    union: () => new OpenJscadObject(),
  },
);
