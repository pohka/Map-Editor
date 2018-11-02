//deals with the input for the palette
class PaletteCamera{
  constructor(vp){
    this.position = new Vector(0,0);
    this.lastCursorPos = new Vector(0,0); //cursor position in document coordinates
    this.addInput(vp);
  }

  //add input listeners
  addInput(vp){
    let cam = this;

    vp.canvas.addEventListener('mousedown',function(e){
      //left mouse button
      if(e.button == 0){
        cam.isPainting = true;
        let rect = vp.canvas.getBoundingClientRect();
        let vpPos = new Vector(
          e.clientX - rect.left,
          e.clientY - rect.top
        );

        let tilePos = cam.findTileCoorAtCursor(vp, e);

        let id = Store.findTileID(vp.imgsrc, tilePos.x, tilePos.y);

        if(Store.isCollisionEditable){
          Store.tiles[id].hasCollision = !Store.tiles[id].hasCollision;
          editor.draw();
        }
        else{ //select tile
          Store.selectedTileID = id;
        }
      }

      vp.draw();
    });
  }

  findTileCoorAtCursor(vp, e){
    //convert the cursor document coordinates to viewport coordinates
    let rect = vp.canvas.getBoundingClientRect();
    let vpPos = new Vector(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    //convert viewport coor to tile coor
    return new Vector(
        Math.floor(vpPos.x/Chunk.tileSize),
        Math.floor(vpPos.y/Chunk.tileSize)
      );
  }
}
