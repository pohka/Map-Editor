//a section of the enite tile map
class Chunk{
  constructor(x, y){
    this.layers = {};
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
    let chunkOffset = new Vector(this.position.x * Chunk.totalSize, -this.position.y * Chunk.totalSize);
    for(let i=Store.layerOrder.length-1; i >= 0; i--){
      let layerName = Store.layerOrder[i];
      this.drawLayer(this.layers[layerName], chunkOffset, camFocus, vp);
    }
  }

  drawLayer(map, chunkOffset, camFocus, vp){
    for(let i=0; i<map.length; i++){
      for(let j=0; j<map[i].length; j++){
        let tileID = map[i][j];
        if(tileID > -1){
          let tile = Store.tiles[tileID];
          if(tile != null){
            let img = Store.findImgObj(tile.src);
            if(img != null){
              vp.ctx.drawImage(img,
                tile.x * Chunk.tileSize, tile.y * Chunk.tileSize, Chunk.tileSize, Chunk.tileSize,
                camFocus.x + (j*Chunk.tileSize) + chunkOffset.x, //destination
                camFocus.y + i*Chunk.tileSize + chunkOffset.y,
                Chunk.tileSize, Chunk.tileSize
              );

              //drawing collision
              if(Store.isCollisionVisible && tile.hasCollision){
                vp.ctx.fillStyle="#0F05";
                vp.ctx.fillRect(
                  camFocus.x + (j*Chunk.tileSize) + chunkOffset.x,
                  camFocus.y + i*Chunk.tileSize + chunkOffset.y,
                  Chunk.tileSize, Chunk.tileSize
                );

                vp.ctx.beginPath();
                vp.ctx.strokeStyle="#0F0";

                vp.ctx.lineWidth="1";
                vp.ctx.rect(
                  camFocus.x + (j*Chunk.tileSize) + chunkOffset.x,
                  camFocus.y + i*Chunk.tileSize + chunkOffset.y,
                  Chunk.tileSize, Chunk.tileSize
                );

                vp.ctx.stroke();
              }
            }
          }
        }
      }
    }
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
