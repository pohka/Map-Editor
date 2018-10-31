class Action{
  //creates a new set tile action
  static newSetTileAction(chunk, tilePos, oldTileID, newTileID, layer){
    return ({
      type : "setTile",
      chunkX : chunk.position.x,
      chunkY : chunk.position.y,
      tileX : tilePos.x,
      tileY : tilePos.y,
      layer : layer,
      oldTileID : oldTileID,
      newTileID : newTileID
    });
  }

  //undo the last action
  static undo(){
    if(Action.stack.length == 0){
      return;
    }

    let lastAction = Action.stack.pop();
    Action.undoAction(lastAction);
    Action.popped.push(lastAction);

    editor.draw();
  }

  //revert the last undo
  static redo(){
    if(Action.popped.length == 0){
      return;
    }
    let lastUndo = Action.popped.pop();
    Action.executeAction(lastUndo, true);
    editor.draw();
  }

  //executes an action
  static executeAction(a, isPoppedAction){
    if(a.type == "setTile"){
      let chunk = Store.findChunkByChunkCoor(a.chunkX, a.chunkY);
      chunk.layers[a.layer][a.tileY][a.tileX] = a.newTileID;
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
  static undoAction(a){
    if(a.type == "setTile"){
      let chunk = Store.findChunkByChunkCoor(a.chunkX, a.chunkY);
      chunk.layers[a.layer][a.tileY][a.tileX] = a.oldTileID;
    }
  }


}

//maximum number of actions to track
Action.maxActions = 50;

//list of the recent actions
Action.stack = [];
//tracking popped actions for redo
Action.popped = [];
