/*
order of coordinate systems:
-document
-viewport
-world
-chunk
-tile
*/

const {dialog} = require('electron').remote;

let mapViewport, tileSelector;

const resDir = "res/";

const VERSION = "0.1";

var CollisionType =
{
  none : 0,
  box : 1,
  topLeft : 2,
  topRight : 3,
  bottomRight : 4,
  bottomLeft : 5
};
Object.freeze(CollisionType);

var newProjectModal;

window.onload = () => {
  disableMiddleBtnScroll();
  mapViewport = new MapViewport("map-viewport");
  tileSelector = new TileSelector("tile-selector");
  newProjectModal = new Modal("new-project-modal");
  Menus.load();
}

//disables scrolling when middle mouse button is held down
function disableMiddleBtnScroll()
{
  document.addEventListener("mousedown", function(e){
    if(e.button==1)
    {
      e.preventDefault();  
      return false
    }
  });
}
