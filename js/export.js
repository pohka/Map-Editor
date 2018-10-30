
function exportProject(){
  let data = {
    chunkSize : Chunk.size,
    tileSize : Chunk.tileSize,
    imgs : [],
    tiles : [],
    chunks : []
  };

  let loc = window.location.href.split("/");
  loc.splice(-1,1);
  let rootpath = loc.join("/") + "/res/";

  for(let i=0; i<Store.imgObjs.length; i++){
    data.imgs.push(Store.imgObjs[i].src.replace(rootpath, ""));
  }

  //for(let id in Store.tiles){
    data.tiles = Store.tiles;
  //}

  for(let i=0; i<Store.chunks.length; i++){
    data.chunks.push({
      map : Store.chunks[i].map,
      x : Store.chunks[i].position.x,
      y : Store.chunks[i].position.y
    });
  }

  var fs = require('fs');
  fs.writeFile("./output/test.json", JSON.stringify(data), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
  });
}

function importProject(){
  var fs = require('fs');

  fs.readFile('./output/test.json', 'utf8', function(err, contents) {
    let data = JSON.parse(contents);

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

    console.log("imported");
    //todo
    //loadImages(data.imgs);
  });

}
