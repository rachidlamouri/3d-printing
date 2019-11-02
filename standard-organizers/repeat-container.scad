use <container.scad>;

module repeatContainer (
    innerWidth,
    innerDepth,
    outerHeight,
    count = 2
) {
  repeatCount = count - 1;
  minWallThickness = defaultMinWallThickness();
  sideMultiple = defaultSideMultiple();
  
  singleOuterWidth = getOuterWidth(innerWidth, minWallThickness, sideMultiple);
  outerDepth = getOuterDepth(innerDepth, minWallThickness, sideMultiple);
  sideWallThickness = getSideWallThickness(innerWidth, minWallThickness, sideMultiple);
  
  startingOuterWidth = count*singleOuterWidth - (repeatCount*sideWallThickness);
  fullOuterWidth = ceil(startingOuterWidth/sideMultiple)*sideMultiple;
  widthDifference = fullOuterWidth - startingOuterWidth;
  
  innerWallPaddingWidth = repeatCount == 0 ? 0 : widthDifference/(repeatCount*sideWallThickness);
  
  for (i = [0 : repeatCount]) {
    translate([i*(singleOuterWidth + innerWallPaddingWidth - sideWallThickness), 0, 0])
    container(innerWidth, innerDepth, outerHeight);
    
    if (i < repeatCount) {
      translate([(i+1)*singleOuterWidth + i*innerWallPaddingWidth - i*sideWallThickness, 0, 0])
      cube([innerWallPaddingWidth, outerDepth, outerHeight]);
    }
  }
  
  echo("--------------------");
  echo("Final dimensions", fullOuterWidth, outerDepth, outerHeight, str("x", count));
  echo("Input dimensions", innerWidth, innerDepth, outerHeight);
  echo("Inner padding", innerWallPaddingWidth);
  echo("--------------------");
}