use <../../container.scad>;

// Base dimensions
baseTolerance = .5;
baseWidth = 150;
baseDepth = 8 - baseTolerance;
height = baseDepth;
hookWidth = 10;

// Arm dimensions
armBaseWidth = 4;
armBaseDepth = 10 + baseTolerance;
armSideWidth = armBaseWidth + hookWidth;
armSideDepth = 4;

armBaseX = baseWidth - hookWidth - armBaseWidth;
armBasePosition = [
  armBaseX,
  baseDepth,
  0
];

armSidePosition = [
  armBaseX,
  baseDepth + armBaseDepth,
  0
];

// Key holder
cube([baseWidth, baseDepth, height]);
translate(armBasePosition)
cube([armBaseWidth, armBaseDepth, height]);
translate(armSidePosition)
cube([armSideWidth, armSideDepth, height]);

// Container dimensions
containerInnerWidth = height + baseTolerance;
containerInnerDepth = baseDepth + baseTolerance;
echo("Container", containerInnerWidth, containerInnerDepth, "x");
