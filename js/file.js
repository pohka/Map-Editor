
function exportProject(){
  let data = {
    projectName : Store.projectName,
    chunkSize : Chunk.size,
    tileSize : Chunk.tileSize,
    imgs : [],
    tiles : Store.tiles,
    chunks : [],
    layerOrder : Store.layerOrder,
    tileCount : Store.tileCount
  };

  let loc = window.location.href.split("/");
  loc.splice(-1,1);
  let rootpath = loc.join("/") + "/projects/" + Store.projectName + "/res/";

  for(let i=0; i<Store.imgObjs.length; i++){
    data.imgs.push(Store.imgObjs[i].src.replace(rootpath, ""));
  }

  for(let i=0; i<Store.chunks.length; i++){
    data.chunks.push({
      x : Store.chunks[i].position.x,
      y : Store.chunks[i].position.y,
      layers : Store.chunks[i].layers
    });
  }

  var fs = require('fs');

  let dir = "./projects/" + Store.projectName;

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  fs.writeFile(dir + "/data.json", JSON.stringify(data), function(err) {
      if(err) {
          return console.log(err);
      }

      Notification.add("Saved Project");
      console.log(data);
  });
}

function importProject(){
  var fs = require('fs');

  let path = "./projects/" + Store.projectName + "/data.json";
  fs.readFile(path, 'utf8', function(err, contents) {
    let data = JSON.parse(contents);
    console.log(data);

    Store.projectName = data.projectName;

    Chunk.size = data.chunkSize;
    Chunk.tileSize = data.tileSize;
    Chunk.totalSize = Chunk.size * Chunk.tileSize;

    Store.tiles = data.tiles;

    Store.chunks = [];
    for(let i=0; i<data.chunks.length; i++){
      Store.chunks.push(new Chunk(
          data.chunks[i].x,
          data.chunks[i].y,
          data.chunks[i].layers
      ));
    }

    Store.imgObjs = [];
    var pathModule = require('path');
    let appRoot = pathModule.resolve(__dirname);

    let loc = window.location.href.split("/");
    loc.splice(-1,1);
    let rootpath = loc.join("/");

    Store.palettes =  [];
    Store.tiles = data.tiles;
    Store.layerOrder = data.layerOrder;
    Store.tileCount = data.tileCount;

    refreshFiles(data.imgs);

    //reset UI variables
    Store.currentPalette = null;
    Store.selectedTileID = -1;
    Store.isCollisionVisible = false;

    Store.isRulersVisible = true;
    let showRulersDOM = document.getElementById("show-ruler");
    showRulersDOM.checked = true;

    Store.isCollisionEditable = false;
    let showCollisionDOM = document.getElementById("show-collision");
    showCollisionDOM.checked = false;

    let paletteSelect = document.getElementById("palette-select");
    paletteSelect.selectedIndex = "0";
    Store.selectedPalette = null;
    tileSelector.draw();

    if(data.layerOrder.length > 0){
      Store.selectedLayer = data.layerOrder[0];
    }
    else{
      Store.selectedLayer = "";
    }

    SectionLayer.updateLayerListDOM();
    Tools.selectTool("brush");



    Notification.add("Loaded Project: " + Store.projectName);
    console.log("imported: " + Store.projectName);
  });

}

//checks to see if they files in /res/ have changed
//loadedImgs is array of file paths e.g. "tilesets/cave.png"
function refreshFiles(loadedImgs){
  walk("./projects/"+Store.projectName+"/res/", loadImages, function(files){
    //check if there is any image files missing
    for(let i in loadedImgs){
      let img = Store.findImgObj(loadedImgs[i])
      if(img == null){
        console.log("Image not found:" + loadedImgs[i]);
        Notification.add("Image file not found: " + loadedImgs[i], true);
      }
    }

    //check if there is any new image files
    for(let i in files){
      let file = files[i].split("\\res\\")[1].replace(/\\/g, "/");
      //if newly added file
      if(loadedImgs.indexOf(file) == -1){
        Notification.add("New image loaded: " + file);
        if(file.indexOf("tilesets/") == 0){
          genTilesFromNewFile(file);
        }
      }
    }

    tileSelector.draw();
    sceneEditor.draw();
  });
}
