# Standard Organizers

## All
- Dimensions should be multiples of 2mm
- The item should fit completely inside of its box
- Tall items can tip, but should be supported by adjacent items, or a custom base

## Rectangles
- rectangle.scad can make uniform rectangle containers
- Outer dimensions are a multiple of 2mm
- Walls are at least 1mm thick
- The bottom is 1mm thick
- There is a center hole that is at least 5mmx5mm
    - The hole will grow to allow at least 16mm from the inner wall to the center of the hole
- The program takes an inner width, inner depth and outer height
    - You can measure the length and width of an object and know which container to pick without adding the wall thickness

## Inserts
- Should fit inside of a standard rectangle
- Filenames: [**smallest-dim**]x[**largest-dim**]x[**height**]
