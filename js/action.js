
/** stores actions in a stack for undo and redo functionality
* , all events which change MapData should use an action
*/
class Action
{
  /**
   * Creates and returns a new set tile action
   * @param {Chunk} chunk - chunk being changed
   * @param {Vector} tilePos - position the tile in the chunk
   * @param {number} oldTileID - id of the current tile
   * @param {number} newTileID - id of the next tile
   * @param {string} layerName - name of layer
   * 
   * @return {Object}
   */
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

  /**
   * Creates and returns a new add layer action
   * @param {string} layerName - name of layer
   * 
   * @return {object} - return
   */
  static newAddLayerAction(layerName)
  {
    return ({
      type : "addLayer",
      layerName : layerName
    });
  }

  /**
   * Creates and returns a new move layer action
   * @param {string} layerName - name of layer
   * @param {number} prevPos - current draw order position
   * @param {number} nextPos - next draw order position
   * 
   * @return {?}
   */
  static newMoveLayerAction(layerName, prevPos, nextPos)
  {
    return ({
      type : "moveLayer",
      layerName : layerName,
      prevPos : prevPos,
      nextPos : nextPos
    });
  }

  /**
   * Creates and returns a new layer visibility action
   * @param {string} layerName - name of layer
   * @param {boolean} nextIsVisible - next state of visibility, true = visible
   * 
   * @return {Object}
   */
  static newLayerVisiblilityAction(layerName, nextIsVisible)
  {
    return ({
      type : "layerVisiblity",
      layerName : layerName,
      nextIsVisible : nextIsVisible
    });
  }

  /**
   * Undo the last action
   */
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

  /**
   * Revert the last undo
   */
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

  /**
   * executes an action
   * 
   * @param {Action} a
   * @param {boolean} [isPoppedAction] - set to true if action has been popped from the stack
   * 
   */
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

    /**
   * executes the reverse of an action
   * 
   * @param {Action} a
   */
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

/** maximum number of actions to track 
 * @type {number}
*/
Action.maxActions = 50;

/** list of the recent actions 
 * @type {array}
*/
Action.stack = [];

/** tracking popped actions from Action.stack for redo 
 * @type {array}
*/
Action.popped = [];
