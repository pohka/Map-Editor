/*
order of coordinate systems:
-document
-viewport
-world
-chunk
-tile
*/

let mapViewport, tileSelector;

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
  mapViewport = new MapViewport("map-viewport");
  tileSelector = new TileSelector("tile-selector");

  //find all the images and preload them
  //walk("./projects/"+Store.projectName+"/res/", loadImages);

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


function createProject()
{
  let projectName = "new-project";//document.querySelector("#new-project-name").value;
  let tileSize = document.querySelector("#new-project-tile").value;
  let chunkSize = document.querySelector("#new-project-chunk").value;

  if(projectName.length > 0){
    projectName = projectName.trim().replace(/\s+/g, "-");
  }

  //validate input
  if(projectName.length == 0 || tileSize <= 0 || chunkSize <= 0)
  {
    Notification.add("Input not valid", true);
    return;
  }

  MapData.project_name = projectName;
  MapData.chunk_size = parseInt(chunkSize);
  MapData.tile_size = parseInt(tileSize);
  MapData.chunk_total_size = MapData.chunk_size * MapData.tile_size;
//  Chunk.size = parseInt(chunkSize);
//  Chunk.tileSize = parseInt(tileSize);
//  Chunk.totalSize = Chunk.size * Chunk.tileSize;
  sampleChunks();
  refreshImages();
  States.current.tileset = "tilesets/cave.png";
  //SectionLayer.addLayer("abc");
  mapViewport.draw();
  tileSelector.draw();
  //todo, uncomment: only draw the current visible canvas
  //tilesetEditor.draw();
  Notification.add("Created Project: " + MapData.projectName);


  toggleModal('.new-project-modal', true);
}


//finds all the files in a directory
var walk = function(dir, done, params) {
  var fs = require('fs');
  var path = require('path');
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results, params);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results, params);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results, params);
        }
      });
    });
  });
};


//placeholder
function sampleChunks()
{
  let chunk = {
    x : 0,
    y : 0,
    textures_used : [ 0 ], //texture ids used in this chunk
    layers : []
  }

  let layer = {
    id : 0,
    map : []
  }

  for(let y = 0; y<MapData.chunk_size; y++)
  {
    let row = [];
    for(let x = 0; x<MapData.chunk_size; x++)
    {
      row.push(-1);
    }
    layer.map.push(row);
  }
  chunk.layers.push(layer);

  MapData.chunks.push(chunk);
}


//preload images
function loadImages(err, files, completed)
{
  let loadedCount = 0;
//  console.log(completed);
  for(let i=0; i<files.length; i++)
  {
    let img = new Image();
    img.onload = function(){
      loadedCount++;
      States.imgObjs.push(this);
      if(loadedCount == files.length)
      {
        completed(files);
      }
    }
    img.src = files[i];
  }
}

//------------------------------

//find any new files in /res/ folder and adds them
function refreshImages()
{
  walk(MapData.dir, function(err, files){
    for(let i in files){
      let file = files[i].replace(/\\/g, "/").split("/res/")[1];
      let existingImg = null;//Store.findImgObj(file);
      if(existingImg == null){

        let img = new Image();
        img.onload = function(){
          States.imgObjs.push(this);
          console.log(file);
          // if(file.indexOf("tilesets/") == 0){
          //   addPaletteOption("/res/" + file);
          //   genTilesFromNewFile(file);
          // }
          Notification.add("New image loaded: " + file);
        }
        img.src = MapData.dir + "res/" + file;
      }
    }

  });
}
