insertTolerance = 1;

cardWidth = 41;
cardDepth = 64;
widthOffsetPercent = .5;
depthOffsetPercent = .55;
offsetCardWidth = cardWidth*widthOffsetPercent;
offsetCardDepth = cardDepth*depthOffsetPercent;
cardHeight = .3;
stepHeight = 2*cardHeight;

function getColor(number) = [.2*number, 0*number, .2*number,];

module damageInsert (
  numberOfCards,
  direction = "depth"
) {
  cube([cardWidth, cardDepth, stepHeight]);

  numberOfAdditionalCards = numberOfCards - 1;
  for (i = [1: numberOfAdditionalCards]) {
    color(getColor(i))
    if (direction == "depth") {
      translate([0, cardDepth + (i - 1)*offsetCardDepth, 0])
      cube([cardWidth, offsetCardDepth, (i+1)*stepHeight]);
    } else {
      translate([cardWidth + (i - 1)*offsetCardWidth, 0, 0])
      cube([offsetCardWidth, cardDepth, (i+1)*stepHeight]);
    }
  }

  if (direction == "depth") {
    totalWidth = cardWidth + insertTolerance;
    totalDepth = cardDepth + numberOfAdditionalCards*offsetCardDepth + insertTolerance;
    totalHeight = (numberOfCards + 1)*stepHeight + insertTolerance;
    echo("Min Outer Dimensions", totalWidth, totalDepth, totalHeight);
  } else {
    totalWidth = cardWidth + numberOfAdditionalCards*offsetCardWidth + insertTolerance;
    totalDepth = cardDepth + insertTolerance;
    totalHeight = (numberOfCards + 1)*stepHeight + insertTolerance;
    echo("Min Outer Dimensions", totalWidth, totalDepth, totalHeight);
  }
}

damageInsert(4, "width");
