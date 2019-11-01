use <../../container.scad>;

/*
  braces: the two outer pieces
  dividers: the three inner pieces
*/

// tolerances
heightTolerance = .2;
widthTolerance = .5;
depthTolerance = widthTolerance;

// base container dimensions
containerBottomThickness = defaultBottomThickness();
containerHeight = 20;

// base insert dimensions
innerHoleWidth = 2.6;
dividerWidth = innerHoleWidth;
dividerDepth = 24.6;
braceDepth = 1;

// computed container dimensions
containerWidth = 4*innerHoleWidth + 3*dividerWidth + widthTolerance;
containerDepth = 2*braceDepth + dividerDepth + depthTolerance;

echo("Container", containerWidth, containerDepth, containerHeight);

// computed insert dimensions
braceWidth = containerWidth - widthTolerance;
insertHeight = containerHeight - containerBottomThickness - heightTolerance;
outerHoleWidth = (braceWidth - (3*dividerWidth + 2*innerHoleWidth))/2;

brace = [braceWidth, braceDepth, insertHeight];
divider = [dividerWidth, dividerDepth, insertHeight];

// top brace
cube(brace);

// bottom brace
translate([0, braceDepth + dividerDepth, 0])
cube(brace);

// divider 1
translate([outerHoleWidth, braceDepth, 0])
cube(divider);

// divider 2
translate([outerHoleWidth + dividerWidth + innerHoleWidth, braceDepth, 0])
cube(divider);

// divider 3
translate([outerHoleWidth + 2*dividerWidth + 2*innerHoleWidth, braceDepth, 0])
cube(divider);
