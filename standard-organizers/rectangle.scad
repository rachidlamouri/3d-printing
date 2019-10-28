innerWidth = undef;
innerDepth = undef;
outerHeight = undef;

bottomThickness = 1;
innerHeight = outerHeight - bottomThickness;
sizeMultiple = 2;
minBottomWallToCenter = 16;
minWallThickness = 1;

outerWidth = ceil((innerWidth + 2*minWallThickness)/sizeMultiple)*sizeMultiple;
outerDepth = ceil((innerDepth + 2*minWallThickness)/sizeMultiple)*sizeMultiple;
widthWallThickness = (outerWidth - innerWidth)/2;
depthWallThickness = (outerDepth - innerDepth)/2;

echo("Width", innerWidth, outerWidth, widthWallThickness);
echo("Depth", innerDepth, outerDepth, depthWallThickness);

holeWidth = max(5, innerWidth - 2*minBottomWallToCenter);
holeDepth = max(5, innerDepth - 2*minBottomWallToCenter);
holeX = widthWallThickness + innerWidth/2 - holeWidth/2;
holeY = depthWallThickness + innerDepth/2 - holeDepth/2;

difference() {
    // Outer box
    cube([outerWidth, outerDepth, outerHeight]);
    
    // Inner box
    translate([widthWallThickness, depthWallThickness, bottomThickness])
    cube([innerWidth, innerDepth, innerHeight]);
    
    // Hole
    translate([holeX, holeY, 0])
    cube([holeWidth, holeDepth, bottomThickness]);
}
