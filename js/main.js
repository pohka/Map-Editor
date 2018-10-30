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
  walk("./res/", loadImages);
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
  //placeholder
  let tileSize = 32;
  for(let i=0; i<4; i++){
    Store.tiles[i] = {
      path : "tilesets/sample.png",
      x : i*tileSize,
      y : 0,
      w : 32,
      h : 32
    };
  }

  sampleChunks();
  editor.draw();
  palette.setImg("tilesets/sample.png");
  palette.draw();
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
      let chunk = new Chunk(map, x, y);
      Store.chunks.push(chunk);
    }
  }


}

//preload images
function loadImages(err, files){
  let loadedCount = 0;
  for(let i=0; i<files.length; i++){
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
