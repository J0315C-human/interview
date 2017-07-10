# mySidewalk Inc Coding Assessment


## Problem 1 (data sorting) 

Notes/instructions: 

* This is a console program made in Python 3.5. There are no extra libraries besides things packaged with the 'builtins'. Just run the program with Python. No assumptions are made about where the input file is located, but the unitTests.py will create a test file in the current working directory.

Assumptions I made:

* Integers, decimals or negative numbers may appear.
* All digits at the front of a line, including up to one decimal and ignoring commas, are considered one 'number'.
* There may be more digits later in the remainder of the line, but they're ignored.
* Alphabetic sorting is case-insensitive, rather than ASCII-ordered.


## Problem 3 (GeoJson visualization) -

Notes/instructions:

* This is a simple web page, all the logic is client-side. You should be able to open up index.html, but an internet connection is needed to pull the dependencies (jquery and leaflet.js).
* If you click the bottom-right legend box, it cycles between highlighting the area colors based on different statistics, as well as the commuter stats by density instead of quantity. This affords some interesting visual comparisons (i.e. there are more 'walkers' closer to downtown.).

Assumptions I made:

* I assumed the user wouldn't care much about visualizing both data sets on the map at the same time, but I decided to leave the neighborhoods/tracts control as checkboxes instead of radio buttons, so it's possible to have both active. The datasets don't exactly overlap each other, so I suppose there are some uses for this.

Apologies/improvements:

* Much of the javascript could be cleaned up and encapsulated into classes. That would have been the next thing I'd have done. There is a lot of global data which isn't so great.
* I wanted to add a way to adjust the highlighting grades/thresholds.
* There are a few css problems I tooled with for a while and couldn't fully iron out, for instance: at some zoom levels, the colored squares in the legend are displayed oddly.

-Joel
