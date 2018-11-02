
function exportProject(){
  let data = {
    projectName : Store.projectName,
    chunkSize : Chunk.size,
    tileSize : Chunk.tileSize,
    imgs : [],
    tiles : [],
    chunks : [],
    layerOrder : Store.layerOrder
  };

  let loc = window.location.href.split("/");
  loc.splice(-1,1);
  let rootpath = loc.join("/") + "/projects/" + Store.projectName + "/res/";

  for(let i=0; i<Store.imgObjs.length; i++){
    data.imgs.push(Store.imgObjs[i].src.replace(rootpath, ""));
  }

  data.tiles = Store.tiles;

  for(let i=0; i<Store.chunks.length; i++){
    data.chunks.push({
      layers : Store.chunks[i].layers,
      x : Store.chunks[i].position.x,
      y : Store.chunks[i].position.y
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

      console.log("Saved: " + Store.projectName);
  });
}

function importProject(){
  var fs = require('fs');

  let path = "./projects/" + Store.projectName + "/data.json";
  fs.readFile(path, 'utf8', function(err, contents) {
    let data = JSON.parse(contents);

    Store.projectName = data.projectName;

    Chunk.size = data.chunkSize;
    Chunk.tileSize = data.tileSize;
    Chunk.totalSize = Chunk.size * Chunk.tileSize;

    Store.tiles = data.tiles;

    Store.chunks = [];
    for(let i=0; i<data.chunks.length; i++){
      Store.chunks.push(new Chunk(
          data.chunks[i].map,
          data.chunks[i].x,
          data.chunks[i].y
      ));
    }

    editor.draw();

    console.log("imported: " + Store.projectName);
  });

}
