"use strict";
// Contains code for managing the index.html page itself.
// Does not contain the logic for managing the map and tournament data,
// that can be found in map.js.
console.log("file loaded");

// Toggle about section when the nav button is clicked.
document.getElementById("about-btn").addEventListener("click", function (e) {
  let about = document.getElementById("about");
  about.hidden = !about.hidden;
});
