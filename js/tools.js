//functionality for tools
class Tools{
  //sets the tileID at the cursor position
  //returns true if the tile was found
  static setTileAtCursor(evt, vp, tileID){
    let mousePos = vp.getCursorWorldPos(evt.clientX, evt.clientY);
    let chunkCoor = vp.worldCoorToChunkCoor(mousePos.x, mousePos.y);
    let chunk = Store.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);
    if(chunk != null){

      let tilePos = chunk.findTileCoorAtWorldPos(mousePos.x, mousePos.y);
      if(tilePos != null){
        let curTileID = chunk.map[tilePos.y][tilePos.x];
        //don't do any action if the tileID doesn't change
        if(curTileID != tileID){
          let action = Action.newSetTileAction(chunk, tilePos, curTileID, tileID);
          Action.executeAction(action);
        }
        return true;
      }
    }

    return false;
  }

  //gets the world position of the tile at the cursor position
  static getTileWorldPosAtCursor(vp, x, y){
    let mousePos = vp.getCursorWorldPos(x, y);
    let chunkCoor = vp.worldCoorToChunkCoor(mousePos.x, mousePos.y);
    let chunk = Store.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);

    if(chunk != null){
      //tile in map coordinate
      let tilePos = chunk.findTileCoorAtWorldPos(mousePos.x, mousePos.y);
      if(tilePos != null){
        let chunkWorldPos = new Vector(
          chunk.position.x * Chunk.totalSize,
          chunk.position.y * Chunk.totalSize
        );

        let tileWorldPos = new Vector(
          chunkWorldPos.x + (tilePos.x * Chunk.tileSize),
          chunkWorldPos.y - (tilePos.y * Chunk.tileSize)
        );

        return tileWorldPos;
      }
    }
    return null;
  }
}
