length = 80;
edgeThickness = 10;
height = .4;
innerLength = length - 2*edgeThickness;

difference() {
    cube([length, length, height]);
    
    translate([edgeThickness, edgeThickness, 0])
    cube([innerLength, innerLength, height]);
}