/*
order of coordinate systems:
-document
-viewport
-world
-chunk
-tile
*/

const {dialog} = require('electron').remote;

//all the existing viewports
let viewports = {}

/** current version of the app 
 * @type {string}
*/
const VERSION = "0.2";

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

var NavType = {
  NONE : 0,
  WALKABLE : 1
};
Object.freeze(NavType);

var newProjectModal;

//called when the electron window is loaded
window.onload = () => {
  disableMiddleBtnScroll();
  viewports["map"] = new MapViewport("map-viewport");
  viewports["tilePalette"] = new TilePaletteViewport("tile-palette");
  viewports["tileNav"] = new TileNavViewport("tile-nav-viewport");
  
  newProjectModal = new Modal("new-project-modal");
  Menus.load();
}

/**disables scrolling when middle mouse button is held down*/
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
