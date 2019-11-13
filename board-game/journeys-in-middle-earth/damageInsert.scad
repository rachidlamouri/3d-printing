cardWidth = 41;
cardDepth = 64;
widthOffsetPercent = .5;
depthOffsetPercent = .55;
offsetCardWidth = cardWidth*widthOffsetPercent;
offsetCardDepth = cardDepth*depthOffsetPercent;
cardHeight = .3;
stepHeight = 2*cardHeight;

function getCardWidth() = cardWidth;
function getCardDepth() = cardDepth;
function getOffsetCardWidth() = offsetCardWidth;
function getOffsetCardDepth() = offsetCardDepth;
function getInsertStepHeight() = stepHeight;
function getColor(number) = [.2*number, 0*number, .2*number,];
function getMinOuterDimensions(direction, numberOfCards, insertTolerance) = direction == "depth"
  ? [
      cardWidth + insertTolerance,
      cardDepth + (numberOfCards - 1)*offsetCardDepth + insertTolerance,
      (numberOfCards + 1)*stepHeight + insertTolerance
  ]
  : [
    cardWidth + (numberOfCards - 1)*offsetCardWidth + insertTolerance,
    cardDepth + insertTolerance,
    (numberOfCards + 1)*stepHeight + insertTolerance,
  ];

module damageInsert (
  numberOfCards,
  direction = "depth",
  insertTolerance = 1
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

  echo("Min Outer Dimensions", getMinOuterDimensions(direction, numberOfCards, insertTolerance));
}

damageInsert(4, "width");
