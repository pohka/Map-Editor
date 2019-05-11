class Action
{
  //creates a new set tile action
  static newSetTileAction(chunk, tilePos, oldTileID, newTileID, layerName)
  {
    return ({
      type : "setTile",
      chunkX : chunk.x,
      chunkY : chunk.y,
      tileX : tilePos.x,
      tileY : tilePos.y,
      layerName : layerName,
      oldTileID : oldTileID,
      newTileID : newTileID
    });
  }

  static newAddLayerAction(layerName)
  {
    return ({
      type : "addLayer",
      layerName : layerName
    });
  }

  static newMoveLayerAction(layerName, prevPos, nextPos)
  {
    return ({
      type : "moveLayer",
      layerName : layerName,
      prevPos : prevPos,
      nextPos : nextPos
    });
  }

  static newLayerVisiblilityAction(layerName, nextIsVisible)
  {
    return ({
      type : "layerVisiblity",
      layerName : layerName,
      nextIsVisible : nextIsVisible
    });
  }

  //undo the last action
  static undo()
  {
    if(Action.stack.length == 0)
    {
      return;
    }

    let lastAction = Action.stack.pop();
    Action.undoAction(lastAction);
    Action.popped.push(lastAction);

    Notification.add("Undo: " + lastAction.type);

    mapViewport.draw();
  }

  //revert the last undo
  static redo()
  {
    if(Action.popped.length == 0)
    {
      return;
    }
    let lastUndo = Action.popped.pop();
    Action.executeAction(lastUndo, true);
    Notification.add("Redo: " + lastUndo.type);
    mapViewport.draw();
  }

  //executes an action
  static executeAction(a, isPoppedAction)
  {
    if(a.type == "setTile"){
      let chunk = MapQuery.findChunkByChunkCoor(a.chunkX, a.chunkY);
      let layer = MapQuery.getChunkLayerByName(chunk, a.layerName);
      layer.map[a.tileY][a.tileX] = a.newTileID;
    }
    else if(a.type == "moveLayer")
    {
      let temp = MapData.draw_layers[a.prevPos];
      MapData.draw_layers[a.prevPos] = MapData.draw_layers[a.nextPos];
      MapData.draw_layers[a.nextPos] = temp;
      Layers.updateList();
      mapViewport.draw();
    }
    else if(a.type == "layerVisiblity")
    {
      States.visibleLayers[a.layerName] = a.nextIsVisible;
      Layers.updateList();
      mapViewport.draw();
    }
    else if(a.type == "addLayer")
    {
      Layers.addLayer(a.layerName);
    }

    Action.stack.push(a);
    if(Action.stack.length > Action.maxActions){
      Action.stack.shift();
    }

    //clears the popped array
    if(!isPoppedAction){
      Action.popped = [];
    }
  }

  //executes the reverse of an action
  static undoAction(a)
  {
    if(a.type == "setTile"){
      let chunk = MapQuery.findChunkByChunkCoor(a.chunkX, a.chunkY);
      let layer = MapQuery.getChunkLayerByName(chunk, a.layerName);
      layer.map[a.tileY][a.tileX] = a.oldTileID;
    }
    else if(a.type == "moveLayer")
    {
      let temp = MapData.draw_layers[a.prevPos];
      MapData.draw_layers[a.prevPos] = MapData.draw_layers[a.nextPos];
      MapData.draw_layers[a.nextPos] = temp;
      Layers.updateList();
      mapViewport.draw();
    }
    else if(a.type == "layerVisiblity")
    {
      States.visibleLayers[a.layerName] = !a.nextIsVisible;
      Layers.updateList();
      mapViewport.draw();
    }
    else if(a.type == "addLayer")
    {
      Layers.deleteLayer(a.layerName);
    }
  }
}

//maximum number of actions to track
Action.maxActions = 50;

//list of the recent actions
Action.stack = [];
//tracking popped actions for redo
Action.popped = [];
