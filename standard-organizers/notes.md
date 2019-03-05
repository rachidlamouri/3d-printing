# Standard Organizers

## All
- Dimensions should be multiples of 5mm
- The item should fit completely inside of its box
- Tall items can tip, but should be supported by adjacent items, or a custom base

## Rectangles
- Filenames: [**smallest-dim**]x[**largest-dim**]x[**height**]-[**solid** | **hollow**]
    - Dimensions are the inner width, inner length and outer height
        - You can measure the length and width of an object and know which container to pick without adding the wall thickness
    - **solid**: walls are solid
    - **hollow**: walls have material removed to reduce print times

- Design:
    - Walls should be 2.5mm thick: add 5mm to the length and width to get the outer dimensions
    - Bottom should be 2mm thick: the overall height should be a multiple of 5mm, so the inside hole will be 2mm shorter
    - Bottom should have a hole inside
        - minimum dimensions are 5mm x 5mm
        - allow 15mm clearance between edge of hole and nearsest wall
    - **hollow**: create cutouts on each wall
        - allow 17.0mm clearance from the bottom of the box to the bottom of the cutout
        - allow 17.5mm clearance from the edge of the outer dimension of the box to the edge of the cutout
