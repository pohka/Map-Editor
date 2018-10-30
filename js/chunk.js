//a section of the enite tile map
class Chunk{
  constructor(map, x, y){
    this.map = map; //2d array of tileIDs
    this.position = new Vector(x,y); //position is in chunk coordinates
  }

  draw(vp, camFocus){
    let chunkOffset = new Vector(this.position.x * Chunk.totalSize, -this.position.y * Chunk.totalSize);
    for(let i=0; i<this.map.length; i++){
      for(let j=0; j<this.map[i].length; j++){
        let colIndex = this.map[i][j];
        if(colIndex > -1){
          let tile = Store.tiles[colIndex];
          if(tile != null){
            let img = Store.findImgObj(tile.src);
            if(img != null){
              vp.ctx.drawImage(img,
                tile.x, tile.y, tile.w, tile.h,
                camFocus.x + (j*Chunk.tileSize) + chunkOffset.x, //destination
                camFocus.y + i*Chunk.tileSize + chunkOffset.y,
                Chunk.tileSize, Chunk.tileSize
              );
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
