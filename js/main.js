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
  loadImages(["sample.png"]);

}

//called once the images are loaded
function ready(){
  //placeholder
  let tileSize = 32;
  for(let i=0; i<4; i++){
    Store.tiles[i] = {
      path : "sample.png",
      x : i*tileSize,
      y : 0,
      w : 32,
      h : 32
    };
  }


  sampleChunks();
  editor.draw();

  palette.setImg("sample.png");
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
function loadImages(imgPaths){
  let loadedCount = 0;
  for(let i=0; i<imgPaths.length; i++){
    let img = new Image();
    img.onload = function(){
        img.src = this.src;
        Store.imgObjs.push(this);
        loadedCount++;
        if(loadedCount == imgPaths.length){
          ready();
        }
    };
    img.src = "res/" + imgPaths[i];
  }
}
