//a section of the enite tile map
class Chunk{
  constructor(x, y, layers){
    if(layers !== undefined){
      this.layers = layers;
    }
    else{
      this.layers = {};
    }
    this.position = new Vector(x,y); //position is in chunk coordinates
  //  this.layers["default"] = Chunk.getEmptyLayer();
  }

  static getEmptyLayer(name){
    let map = [];
    for(let a=0; a<Chunk.size; a++){
      let row = [];
      for(let b=0; b<Chunk.size; b++){
        row.push(-1);
      }
       map.push(row);
    }
    return map;
  }

  draw(vp, camFocus){
    let chunkOffset = this.getChunkOffset(); //new Vector(this.position.x * Chunk.totalSize, -this.position.y * Chunk.totalSize);
    for(let i=Store.layerOrder.length-1; i >= 0; i--){
      let layerName = Store.layerOrder[i];
      this.drawLayer(this.layers[layerName], chunkOffset, camFocus, vp);
    }
  }

  //drawing collision
  drawCollision(vp, camFocus){
    let chunkOffset = this.getChunkOffset(); //new Vector(this.position.x * Chunk.totalSize, -this.position.y * Chunk.totalSize);

    //style
    vp.ctx.fillStyle="#0F05";
    vp.ctx.strokeStyle="#0F0";
    vp.ctx.lineWidth="1";

    for(let y=0; y<Chunk.size; y++){
      for(let x=0; x<Chunk.size; x++){
        for(let i in this.layers){
          let tileID = this.layers[i][y][x];
          if(tileID > -1){
            let tile = Store.tiles[tileID];
             if(tile !== undefined && tile.hasCollision){

               let xx = camFocus.x + (x*Chunk.tileSize) + chunkOffset.x;
               let yy = camFocus.y + (y*Chunk.tileSize) + chunkOffset.y;
               let w = Chunk.tileSize;
               let h = Chunk.tileSize;

              vp.ctx.fillRect(xx, yy, w, h);

              vp.ctx.beginPath();
              vp.ctx.rect(xx, yy, w, h);
              vp.ctx.stroke();
              break;
            }
          }
        }
      }
    }
  }

  //draws the tiles
  drawLayer(map, chunkOffset, camFocus, vp){
    for(let i=0; i<map.length; i++){
      for(let j=0; j<map[i].length; j++){
        let tileID = map[i][j];
        if(tileID > -1){
          let tile = Store.tiles[tileID];
          if(tile != null){
            let img = Store.findImgObj(tile.src);
            if(img != null){
              let srcX = tile.x * Chunk.tileSize,
                  srcY = tile.y * Chunk.tileSize,
                  destX = camFocus.x + (j*Chunk.tileSize) + chunkOffset.x,
                  destY = camFocus.y + i*Chunk.tileSize + chunkOffset.y;

              vp.ctx.drawImage(img,
                srcX, srcY, Chunk.tileSize, Chunk.tileSize,
                destX, destY, Chunk.tileSize, Chunk.tileSize
              );
            }
          }
        }
      }
    }
  }

  getChunkOffset(){
    return new Vector(this.position.x * Chunk.totalSize, -this.position.y * Chunk.totalSize);
  }

  //converts world coordinates to map indexes
  //returns null if tile is not within this chunk
  findTileCoorAtWorldPos(worldX, worldY){
    let chunkWorldX = this.position.x * Chunk.totalSize;
    let chunkWorldY = this.position.y * Chunk.totalSize;

    //difference between the world position and the chunk world start position
    let diffX = worldX - chunkWorldX;
    let diffY = worldY - chunkWorldY;

    let tileX = parseInt(diffX / Chunk.tileSize);
    let tileY = -parseInt(diffY / Chunk.tileSize);

    //if invalid tile coordinate
    if(tileX < 0 || tileX >= Chunk.size ||
      tileY < 0 || tileY >= Chunk.size){
        console.log(tileX, tileY);
      return null;
    }

    return new Vector(tileX, tileY);
  }
}
Chunk.size = 16; //width and height of the map
Chunk.tileSize = 32; //pixel size of each tile
Chunk.totalSize = Chunk.size * Chunk.tileSize; //total pixel size of a chunk
