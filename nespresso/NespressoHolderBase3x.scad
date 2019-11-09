use <../standard-organizers/container.scad>;

innerWidth = 132;
innerDepth = 85;
minWallThickness = defaultMinWallThickness();
sideMultiple = defaultSideMultiple();

outerWidth = getOuterWidth(innerWidth, minWallThickness, sideMultiple);
outerDepth = getOuterDepth(innerDepth, minWallThickness, sideMultiple);

plateDepth = defaultBottomClearance();
plate = [
  outerWidth,
  plateDepth,
  defaultBottomThickness()
];

container(innerWidth, innerDepth, 10);

translate([0, outerDepth/2 - plateDepth/2, 0])
cube(plate);
