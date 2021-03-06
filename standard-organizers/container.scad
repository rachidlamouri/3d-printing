function defaultBottomThickness() = 1;
function defaultBottomClearance() = 16;
function defaultMinWallThickness() = 1;
function defaultWallClearance() = 16;
function defaultSideMultiple() = 2;

function getOuterWidth(innerWidth, minWallThickness, sideMultiple) = ceil((innerWidth + 2*minWallThickness)/sideMultiple)*sideMultiple;
function getOuterDepth(innerDepth, minWallThickness, sideMultiple) = ceil((innerDepth + 2*minWallThickness)/sideMultiple)*sideMultiple;

function getSideWallThickness(innerWidth, minWallThickness, sideMultiple) = (getOuterWidth(innerWidth, minWallThickness, sideMultiple) - innerWidth)/2;
function getFrontWallThickness(innerDepth, minWallThickness, sideMultiple) = (getOuterDepth(innerDepth, minWallThickness, sideMultiple) - innerDepth)/2;

function getFrontHoleWidth(innerWidth, frontWallClearance) = max(5, innerWidth - 2*frontWallClearance);
function getSideHoleDepth(innerDepth, sideWallClearance) = max(5, innerDepth - 2*sideWallClearance);

function getFrontHole(innerWidth, innerDepth, outerHeight, bottomClearance, minWallThickness, frontWallClearance, sideMultiple) = [
  [
    getSideWallThickness(innerWidth, minWallThickness, sideMultiple) + (innerWidth/2 - getFrontHoleWidth(innerWidth, frontWallClearance)/2),
    0,
    bottomClearance
  ],
  [
    getFrontHoleWidth(innerWidth, frontWallClearance),
    getOuterDepth(innerDepth, minWallThickness, sideMultiple),
    outerHeight
  ]
];

function getSideHole(innerWidth, innerDepth, outerHeight, bottomClearance, minWallThickness, sideWallClearance, sideMultiple) = [
  [
    0,
    getFrontWallThickness(innerDepth, minWallThickness, sideMultiple) + (innerDepth/2 - getSideHoleDepth(innerDepth, sideWallClearance)/2),
    bottomClearance
  ],
  [
    getOuterWidth(innerWidth, minWallThickness, sideMultiple),
    getSideHoleDepth(innerDepth, sideWallClearance),
    outerHeight
  ]
];

module container (
  innerWidth,
  innerDepth,
  outerHeight,
  type = "solid",
  bottomThickness = defaultBottomThickness(),
  bottomClearance = defaultBottomClearance(),
  minWallThickness = defaultMinWallThickness(),
  frontWallClearance = defaultWallClearance(),
  sideWallClearance = defaultWallClearance(),
  sideMultiple = defaultSideMultiple()
) {
  innerHeight = outerHeight - bottomThickness;

  outerWidth = getOuterWidth(innerWidth, minWallThickness, sideMultiple);
  outerDepth = getOuterDepth(innerDepth, minWallThickness, sideMultiple);
  sideWallThickness = getSideWallThickness(innerWidth, minWallThickness, sideMultiple);
  frontWallThickness = getFrontWallThickness(innerDepth, minWallThickness, sideMultiple);

  echo("File dimensions", innerWidth, innerDepth, outerHeight);
  echo("Outer dimensions", outerWidth, outerDepth, outerHeight);
  echo("Walls", sideWallThickness, frontWallThickness);

  baseHoleWidth = max(5, innerWidth - 2*bottomClearance);
  holeWidth = baseHoleWidth > innerWidth ? innerWidth/2 : baseHoleWidth;
  baseHoleDepth = max(5, innerDepth - 2*bottomClearance);
  holeDepth = baseHoleDepth > innerDepth ? innerDepth/2 : baseHoleDepth;
  holeX = sideWallThickness + innerWidth/2 - holeWidth/2;
  holeY = frontWallThickness + innerDepth/2 - holeDepth/2;

  frontHole = getFrontHole(
    innerWidth,
    innerDepth,
    outerHeight,
    bottomClearance,
    minWallThickness,
    frontWallClearance,
    sideMultiple
  );
  frontHolePosition = frontHole[0];
  frontHoleDimesions = frontHole[1];

  sideHole = getSideHole(
    innerWidth,
    innerDepth,
    outerHeight,
    bottomClearance,
    minWallThickness,
    sideWallClearance,
    sideMultiple
  );
  sideHolePosition = sideHole[0];
  sideHoleDimensions = sideHole[1];

  difference() {
    // Outer box
    cube([outerWidth, outerDepth, outerHeight]);

    // Inner box
    translate([sideWallThickness, frontWallThickness, bottomThickness])
    cube([innerWidth, innerDepth, innerHeight]);

    // Bottom hole
    translate([holeX, holeY, 0])
    cube([holeWidth, holeDepth, bottomThickness]);

    if(type == "hollow") {
      // Front and back hole
      translate(frontHolePosition)
      cube(frontHoleDimesions);

      // Side holes
      translate(sideHolePosition)
      cube(sideHoleDimensions);
    }
  }
}
