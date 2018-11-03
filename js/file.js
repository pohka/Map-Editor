
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

var imported;
function importProject(){
  var fs = require('fs');

  let path = "./projects/" + Store.projectName + "/data.json";
  fs.readFile(path, 'utf8', function(err, contents) {
    let data = JSON.parse(contents);
    console.log(data);
    imported = data;

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
    for(let i in data.imgs){
      data.imgs[i] = appRoot + "/projects/" + data.projectName + "/res/" + data.imgs[i];
      data.imgs[i] = data.imgs[i].replace(/\//g, "\\");
    }
    loadImages(null, data.imgs, false);
    Store.tiles = data.tiles;
    Store.layerOrder = data.layerOrder;
    Store.tileCount = data.tileCount;

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

    if(data.layerOrder.length > 0){
      Store.selectedLayer = data.layerOrder[0];
    }
    else{
      Store.selectedLayer = "";
    }

    SectionLayer.updateLayerListDOM();
    Tools.selectTool("brush");



    editor.draw();


    Notification.add("Loaded Project: " + Store.projectName);
    console.log("imported: " + Store.projectName);
  });

}
