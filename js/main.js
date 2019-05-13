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

window.onload = () => {
  disableMiddleBtnScroll();
  mapViewport = new MapViewport("map-viewport");
  tileSelector = new TileSelector("tile-selector");
  States.loadMenus();
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

function toggleModal(sel, hide)
{
  let modal = document.querySelector(sel);

  if(hide !== undefined){
    if(!hide){
      modal.style.display = "block";
    }
    else{
      modal.style.display = "none";
    }
  }
  else if (modal.style.display == ""  || modal.style.display === "none" ) {
        modal.style.display = "block";
  }
  else {
      modal.style.display = "none";
  }
}


function modalSetPath(el)
{
  let options = {
    properties: ['openDirectory']
  };

  dialog.showOpenDialog(
    options, (result) => {
      if(
        result !== undefined && result.length > 0 && 
        result[0] !== undefined && result[0].length > 0
        )
      {
        let path = result[0].replace(/\\/g,"/");
        el.value = path;
      }
  });
}


// //finds all the files in a directory
// var walk = function(dir, done, params) {
//   var fs = require('fs');
//   var path = require('path');
//   var results = [];
//   fs.readdir(dir, function(err, list) {
//     if (err) return done(err);
//     var pending = list.length;
//     if (!pending) return done(null, results, params);
//     list.forEach(function(file) {
//       file = path.resolve(dir, file);
//       fs.stat(file, function(err, stat) {
//         if (stat && stat.isDirectory()) {
//           walk(file, function(err, res) {
//             results = results.concat(res);
//             if (!--pending) done(null, results, params);
//           });
//         } else {
//           results.push(file);
//           if (!--pending) done(null, results, params);
//         }
//       });
//     });
//   });
// };

