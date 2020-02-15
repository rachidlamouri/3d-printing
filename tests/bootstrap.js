class OpenJscadObject {
  translate() {
    return this;
  }

  setColor() {
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
