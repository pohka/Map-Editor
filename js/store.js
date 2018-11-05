//gloabl storage of variables
//also helps find the variables
const Store = {
  projectName : null,
  chunks : [],
  imgObjs : [],
  tiles : {},
  layerOrder : [],
  tileCount : -1,
  palettes : [],

  //ui based variables
  selectedPalette : null,
  selectedTileID : -1,
  selectedLayer : "",
  isCollisionVisible : false,
  isRulersVisible : true,
  isCollisionEditable : false,
  editorViewOpts : ["scene", "tileset", "object"],
  selectedEditorView : "scene",
};

Store.genTileID = function(){
  Store.tileCount++;
  return Store.tileCount;
}

//find the image object with the matching path in /res/ folder
//e.g. findImgObj("sample.png") will find image in /res/sample.png
Store.findImgObj = function(path){
  if(path == null){
    return null;
  }
  
  let loc = window.location.href.split("/");
  loc.splice(-1,1);
  let rootpath = loc.join("/");
  let fullpath  = rootpath + "/projects/" + Store.projectName + "/res/" + path;


  for(let i=0; i<Store.imgObjs.length; i++){
    if(Store.imgObjs[i].src == fullpath){
      return Store.imgObjs[i];
    }
  }
  console.log("warning: img not found ", path);
  return null;
}

//returns a chunk with a matching chunk coordinate
//returns null if no match is found
Store.findChunkByChunkCoor = function(x, y){
  for(let i=0; i<Store.chunks.length; i++){
    if(Store.chunks[i].position.x == x && Store.chunks[i].position.y == y){
      return Store.chunks[i];
    }
  }
  return null;
}

//returns the chunk that contains the world position
//returns null if no match is found
Store.findChunkAtWorldPos = function(vp, worldX, worldY){
  let chunkCoor = vp.worldCoorToChunkCoor(worldX, worldY);
  let chunk = Store.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);
  return chunk;
}

//find a tile with the matching coordintates and src img
//returns -1 if not found
Store.findTileID = function(src, x, y){
  for(let id in Store.tiles){
    if(Store.tiles[id].x == x && Store.tiles[id].y == y && Store.tiles[id].src == src){
      return id;
    }
  }
  return -1;
}
