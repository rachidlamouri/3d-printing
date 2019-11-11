insertTolerance = 1;

cardWidth = 41;
cardDepth = 64;
offsetPercent = .55;
offsetCardDepth = cardDepth*offsetPercent;
leftOverCardDepth = cardDepth*(1 - offsetPercent);
cardHeight = .3;
stepHeight = 2*cardHeight;

function getColor(number) = [.2*number, 0*number, .2*number,];

module makeDamageInsert (numberOfCards) {
  cube([cardWidth, cardDepth, stepHeight]);

  numberOfAdditionalCards = numberOfCards - 1;
  for (i = [1: numberOfAdditionalCards]) {
    color(getColor(i))
    translate([0, cardDepth + (i - 1)*offsetCardDepth, 0])
    cube([cardWidth, offsetCardDepth, (i+1)*stepHeight]);
  }

  totalWidth = cardWidth + insertTolerance;
  totalDepth = cardDepth + numberOfAdditionalCards*offsetCardDepth + insertTolerance;
  totalHeight = (numberOfCards + 1)*stepHeight + insertTolerance;
  echo("Min Outer Dimensions", totalWidth, totalDepth, totalHeight);
}

makeDamageInsert(4);
