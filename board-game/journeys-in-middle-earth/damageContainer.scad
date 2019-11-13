use <../../standard-organizers/container.scad>;
use <./damageInsert.scad>;

numberOfCards = 4;
direction = "width";
holeRadius = 7.5;
outerContainerHeight = 6;
insertTolerance = 0;

containerDimensions = getMinOuterDimensions(direction, numberOfCards, insertTolerance);
innerContainerWidth = containerDimensions[0];
innerContainerDepth = containerDimensions[1];
bottomThickness = 0;
minWallThickness = defaultMinWallThickness();
sideMultiple = defaultSideMultiple();

containerFrontWallThickness = getFrontWallThickness(innerContainerDepth, minWallThickness, sideMultiple);
containerSideWallThickness = getSideWallThickness(innerContainerWidth, minWallThickness, sideMultiple);

module makeCylinders () {
  cylinder(outerContainerHeight, r = holeRadius);

  move = direction == "depth"
    ?  [2*containerSideWallThickness + innerContainerWidth, 0, 0]
    : [0, 2*containerFrontWallThickness + innerContainerDepth, 0];
  translate(move)
  cylinder(outerContainerHeight, r = holeRadius);
}

difference(){
  union(){
    translate([containerSideWallThickness, containerFrontWallThickness, 0])
    damageInsert(numberOfCards, direction, insertTolerance);

    container(
      innerContainerWidth,
      innerContainerDepth,
      outerContainerHeight,
      "solid",
      bottomThickness
    );
  }

  move0 = direction == "depth"
    ? [0, containerFrontWallThickness, 0]
    : [containerSideWallThickness, 0, 0];
  translate(move0) {
    move1 = direction == "depth"
      ? [0, getCardDepth()/2, 0]
      : [getCardWidth()/2, 0, 0];
    translate(move1){
      makeCylinders();

      // move2 = direction == "depth"
      //     ? [0, getOffsetCardDepth() - getCardDepth()/2, 0]
      //     : [(getCardWidth() - getOffsetCardWidth())/2, 0, 0];
      translate(move1) {
        for (i = [1:numberOfCards - 1]) {
          move3 = direction == "depth"
            ? [0, getOffsetCardDepth()/2 + (i-1)*getOffsetCardDepth(), 0]
            : [getOffsetCardWidth()/2 + (i-1)*getOffsetCardWidth(), 0, 0];

          translate(move3)
          makeCylinders();
        }
      }
    }
  }
}
