use <../../../standard-organizers/container.scad>;

// 4 coaster container dimensions
innerWidth = 91;
innerDepth = 14;

// 8 coaster container dimensions
outerHeight = 50;
separatorDepth = 1;
innerDepthWithSeparator = 2*innerDepth + separatorDepth;

bottomClearance = 20;
minWallThickness = defaultMinWallThickness();
sideMultiple = defaultSideMultiple();
frontWallClearance = bottomClearance;
sideWallThickness = getSideWallThickness(innerWidth, minWallThickness, sideMultiple);

holeBottomClearance = 0;
holeWallClearance = bottomClearance;
separatorHole = getFrontHole(
    innerWidth,
    innerDepthWithSeparator,
    outerHeight,
    holeBottomClearance,
    minWallThickness,
    frontWallClearance,
    sideMultiple
);

outerDepth = getOuterDepth(innerDepthWithSeparator, minWallThickness, sideMultiple);
separatorX = sideWallThickness;
separatorY = outerDepth/2 - separatorDepth/2;

container(
    innerWidth,
    innerDepthWithSeparator,
    outerHeight,
    "hollow",
    defaultBottomThickness(),
    bottomClearance,
    minWallThickness,
    frontWallClearance,
    100,
    sideMultiple
);

difference() {
    // separator
    translate([separatorX, separatorY, 0])
    cube([innerWidth, separatorDepth, outerHeight]);
    
    // separator hole
    translate(separatorHole[0])
    cube(separatorHole[1]);
}
