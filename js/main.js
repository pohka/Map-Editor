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

  //find all the images and preload them
  walk("./projects/"+Store.projectName+"/res/", loadImages);
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

//called once the images are loaded
function ready(){
  setupPaletteAndTiles();
  setupCollision();
  sampleChunks();
  editor.draw();
  palette.draw();
  Notification.add("Ready");
}


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
function loadImages(err, files){
  setDefaultPaletteOption();

  let loadedCount = 0;
  for(let i=0; i<files.length; i++){
    addPaletteOption(files[i]);


    let img = new Image();
    img.onload = function(){
      loadedCount++;
      Store.imgObjs.push(this);
      if(loadedCount == files.length){
        ready();
      }
    }
    img.src = files[i];
  }
}

//setup for the palette options
function setDefaultPaletteOption(){
  let select = document.getElementById("palette-select");
  let option = document.createElement("option");
  option.text = "Select Palette";
  option.disabled = true;
  option.selected = true;
  select.add(option);
  //new option selected
  select.addEventListener("change", function(e){
    palette.setImg(e.srcElement.value);
    palette.draw();
    Store.selectedTileID = -1;
  });
}

function setupPaletteAndTiles(){
  //create all the tiles
  let select = document.getElementById("palette-select");
  for(let i=0; i<select.options.length; i++){
    let opt = select.options[i];
    if(opt.disabled == false){
      let img = Store.findImgObj(opt.text);
      let maxX = img.width/Chunk.tileSize;
      let maxY = img.height/Chunk.tileSize;

      for(let y=0; y<maxY; y++){
        for(let x=0; x<maxX; x++){
          let id = Store.genTileID();
          Store.tiles[id] = ({
            src : opt.text,
            x : x,
            y : y,
            hasCollision : x%2==0,
          });
        }
      }
    }
  }
}

//add an image to the palette
function addPaletteOption(filePath){
  let path = filePath.split("\\res\\")[1].replace(/\\/g,"/");
  let select = document.getElementById("palette-select");
  let option = document.createElement("option");
  option.text = path;
  select.add(option);
}

function setupCollision(){
  let showCollision = document.getElementById("show-collision");
  showCollision.addEventListener("click", function(e){
      Store.isCollisionVisible = showCollision.checked;
      editor.draw();
  });

  let showRulers = document.getElementById("show-ruler");
  showRulers.addEventListener("click", function(e){
    Store.isRulersVisible = showRulers.checked;
    editor.draw();
  })
}
