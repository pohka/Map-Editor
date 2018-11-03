/*
order of coordinate systems:
-document
-viewport
-world
-chunk
-tile


*/

let editor, palette;

window.onload = () => {
  editor = new EditorViewport("editor", 1100, 700);
  palette = new PaletteViewport("palette", 512, 512);
  setupDOMs();

  //find all the images and preload them
  //walk("./projects/"+Store.projectName+"/res/", loadImages);
}

function createProject(){
  Store.projectName = "test_" + Math.floor(Math.random() * 100000);
  Chunk.size = 16;
  Chunk.tileSize = 32;
  Chunk.totalSize = Chunk.size * Chunk.tileSize;
  sampleChunks();
  editor.draw();
  palette.draw();
  Notification.add("Created Project: " + Store.projectName);
}


//finds all the files in a directory
var walk = function(dir, done) {
  var fs = require('fs');
  var path = require('path');
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};


//placeholder
function sampleChunks(){
  let max = 4;

  for(let y=-max; y<max; y++){
    for(let x=-max; x<max; x++){
      let map = [];
      for(let a=0; a<Chunk.size; a++){
        let row = [];
        for(let b=0; b<Chunk.size; b++){
          row.push(-1);
        }
         map.push(row);
      }
      let chunk = new Chunk(x, y);
      Store.chunks.push(chunk);
    }
  }
}


//preload images
function loadImages(err, files, completed){
  let loadedCount = 0;
  for(let i=0; i<files.length; i++){
    addPaletteOption(files[i]);


    let img = new Image();
    img.onload = function(){
      loadedCount++;
      Store.imgObjs.push(this);
      if(loadedCount == files.length){
        completed();
      }
    }
    img.src = files[i];
  }
}

//todo move to section-palette.js
//------------------------------

//creates the tiles when the palette is added for the first time
function setupPaletteAndTiles(){
  for(let i=0; i<Store.palettes.length; i++){
    let img = Store.findImgObj(Store.palettes[i]);
    let maxX = img.width/Chunk.tileSize;
    let maxY = img.height/Chunk.tileSize;

    for(let y=0; y<maxY; y++){
      for(let x=0; x<maxX; x++){
        let id = Store.genTileID();
        Store.tiles[id] = ({
          src : Store.palettes[i],
          x : x,
          y : y,
          hasCollision : false,
        });
      }
    }
  }
}

//add an image to the palette
function addPaletteOption(filePath){
  filePath = filePath.replace(/\\/g, "/");
  let els = filePath.split("/res/");
  let path;
  if(els.length > 1){
    path = els[1];
  }
  else{
    path = filePath;
  }
  Store.palettes.push(path);
  updatePaletteOptionDOM();
}

//updates the palette option
function updatePaletteOptionDOM(){
  let select = document.getElementById("palette-select");
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  let placeholder = document.createElement("option");
  placeholder.text = "Select Palette";
  placeholder.disabled = true;
  if(Store.selectedPalette == null){
    placeholder.selected = true;
  }
  select.add(placeholder);

  for(let i in Store.palettes){
    let option = document.createElement("option");
    option.text = Store.palettes[i];
    select.add(option);
  }
}

//------------------------------

//sets up the DOM events for some of the UI
function setupDOMs(){
  let showCollision = document.getElementById("show-collision");
  showCollision.addEventListener("click", function(e){
      Store.isCollisionVisible = showCollision.checked;
      editor.draw();
  });

  let showRulers = document.getElementById("show-ruler");
  showRulers.addEventListener("click", function(e){
    Store.isRulersVisible = showRulers.checked;
    editor.draw();
  });

  let editCollision = document.getElementById("edit-collision");
  editCollision.addEventListener("click", function(e){
    Store.isCollisionEditable = editCollision.checked;
  });
}
