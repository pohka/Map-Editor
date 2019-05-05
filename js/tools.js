//functionality for tools
class Tools
{
  //sets the tileID at the cursor position
  //returns true if the tile was found
  static setTileAtCursor(evt, vp, tileID)
  {
    let mousePos = vp.getCursorWorldPos(evt.clientX, evt.clientY);
    let chunkCoor = vp.worldCoorToChunkCoor(mousePos.x, mousePos.y);
    let chunk = MapQuery.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);
    if(chunk != null)
    {
      let tilePos = MapQuery.findTileCoorAtWorldPos(chunk, mousePos.x, mousePos.y);
      let layer = MapQuery.getChunkLayerByID(chunk, States.current.layer);
      if(tilePos != null && layer != null)
      {
        let curTileID = layer.map[tilePos.y][tilePos.x];
        //don't do any action if the tileID doesn't change
        if(curTileID != tileID)
        {
          let action = Action.newSetTileAction(chunk, tilePos, curTileID, tileID, States.current.layer);
          Action.executeAction(action);
        }
        return true;
      }
      console.log("layer or tile not found", layer);
      console.log(chunk);
    }

    return false;
  }

  //gets the world position of the tile at the cursor position
  static getTileWorldPosAtCursor(vp, x, y)
  {
    let mousePos = vp.getCursorWorldPos(x, y);
    let chunkCoor = vp.worldCoorToChunkCoor(mousePos.x, mousePos.y);
    let chunk = MapQuery.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);

    if(chunk != null)
    {
      //tile in map coordinate

      let tilePos = MapQuery.findTileCoorAtWorldPos(chunk, mousePos.x, mousePos.y);
      if(tilePos != null)
      {
        let chunkWorldPos = new Vector(
          chunk.x * MapData.chunk_total_size,
          chunk.y * MapData.chunk_total_size
        );

        let tileWorldPos = new Vector(
          chunkWorldPos.x + (tilePos.x * MapData.tile_size),
          chunkWorldPos.y - (tilePos.y * MapData.tile_size)
        );
        
        return tileWorldPos;
      }
    }
    return null;
  }

  static selectTool(name)
  {
    States.current.tool = name;
  }
}

Tools.brushSize = 1;
