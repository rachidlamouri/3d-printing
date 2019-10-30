outerWidth = 20;
outerDepth = 1;
connectorWidth = 3;
connectorDepth = 25;
height = 18;
innerHoleWidth = connectorWidth;
outerHoleWidth = (outerWidth - (3*connectorWidth + 2*innerHoleWidth))/2;

outerWall = [outerWidth, outerDepth, height];
connector = [connectorWidth, connectorDepth, height];

widthTolerance = 1;
depthTolerance = widthTolerance;
heightTolerance = 2;
containerWidth = outerWidth + widthTolerance;
containerDepth = 2*outerDepth + connectorDepth + depthTolerance;
containerHeight = height + heightTolerance;
echo("Container", containerWidth, containerDepth, containerHeight);

// top wall
cube(outerWall);

// bottom wall
translate([0, outerDepth + connectorDepth, 0])
cube(outerWall);

// connector 1
translate([outerHoleWidth, outerDepth, 0])
cube(connector);

// connector 2
translate([outerHoleWidth + connectorWidth + innerHoleWidth, outerDepth, 0])
cube(connector);

// connector 1
translate([outerHoleWidth + 2*connectorWidth + 2*innerHoleWidth, outerDepth, 0])
cube(connector);