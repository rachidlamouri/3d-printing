const { Cube, Cylinder, Trapezoid } = require('./lib/utils');

module.exports.main = () => {
  const labelHole = new Cube({
    width: 50,
    depth: 12,
    height: 0.2,
  });

  const braceHole = new Trapezoid({
    bottomDepth: labelHole.depth,
    topDepth: labelHole.depth - 2, // the second term is arbitrary
    height: 1,
    width: labelHole.width,
  });

  const magnetHole = new Cylinder({
    diameter: 10,
    height: 3,
    allowance: {
      diameter: 1,
      height: 0.1,
    },
  });

  const wallThickness = 2;
  const thicknessBetweenMagnetAndPaper = 1;
  const base = new Cube({
    width: labelHole.width,
    depth: labelHole.depth + wallThickness,
    height: magnetHole.height + thicknessBetweenMagnetAndPaper + labelHole.height + braceHole.height,
  });

  const fridgeMagnet = base
    .centerToOrigin()
    .difference(magnetHole.centerToOrigin())
    .difference(
      labelHole
        .centerToOrigin()
        .translateZ(magnetHole.height + thicknessBetweenMagnetAndPaper),
      braceHole
        .centerToOrigin()
        .translateZ(magnetHole.height + thicknessBetweenMagnetAndPaper + labelHole.height),
    );

  return fridgeMagnet.csg;
};
