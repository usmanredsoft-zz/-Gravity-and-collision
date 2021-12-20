# -Gravity-and-collision
 Gravity and collision (physics) on DOM-Elements.
 
 
 1. The black elements and the small "balls" should have gravity and collision. This part could be done with e.g. matter.js(?) or any other canvas-framework that can handle collision and gravity. It should be performant and have a good broswer complatibility. Direct DOM manipulation via JS is also possible, but we could not research anything that fits our needs (especially collision-detection of complex shapes).

2. The container must be variable. The animation must work on desktop and mobile screens. The size of the elements should respond to the screen size.

3. The letters of text inside the back shapes should be displaced randomly when not hovered with the mouse cursor. On mouse-over they should align correctly. On mouse-leave they should shift into a different displaced state. The letters do not need gravity / collision. They shoud stay somehow visible inside their shapes as in in the design. Theoretically this could be a simple css-animations (transform) of each letter with random generated values.

4. The elements itself are links and should be generated from the DOM. As the text doesn't change this is NOT a essential feature. 
