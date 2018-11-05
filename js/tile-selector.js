
class TileSelector extends BetterVP{
  constructor(id, w, h){
    super(id, w, h);
    let camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    this.camPos.moveBy(-camOffset.x, -camOffset.y);

    this.addInput();
  }

  addInput(){
    let vp = this;
    vp.canvas.addEventListener('mousedown',function(e){
      //left mouse button
      if(e.button == 0){
        let mousePos = vp.getCursorWorldPos(e.clientX, e.clientY);
        let tileCoor = new Vector(
          Math.floor(mousePos.x/Chunk.tileSize),
          -Math.ceil(mousePos.y/Chunk.tileSize),
        );

        let tileID = Store.findTileID(Store.selectedPalette, tileCoor.x, tileCoor.y);
        if(tileID > -1){
          Store.selectedTileID = tileID;
        }
      }
    });

    document.addEventListener("mousemove", function(e){
      //let isOverViewport = this.isCursorOverViewport(e.clientX, e.clientY);
        vp.draw();
    })
  }

  draw(){
    super.clear();

    let img = this.img = Store.findImgObj(Store.selectedPalette);
    if(img != null){
      let camFocus = this.getWorldFocus();
      let imgPos = new Vector(0, 0);
      this.ctx.drawImage(this.img, imgPos.x + camFocus.x, -imgPos.y + camFocus.y);

      this.drawHUD(camFocus);
    }

    if(Store.isRulersVisible){
      this.ruler.draw(this);
    }
  }

  drawHUD(camFocus){
    //tile highlighter at cursor
    let mousePos = this.getCursorWorldPos(this.lastCursorPos.x, this.lastCursorPos.y);

    let tileCoor = new Vector(
      Math.floor(mousePos.x/Chunk.tileSize),
      -Math.ceil(mousePos.y/Chunk.tileSize),
    );

    this.ctx.fillStyle = "#ccc6";
    this.ctx.strokeStyle="#fff";

    let x = tileCoor.x * Chunk.tileSize + camFocus.x;
    let y = tileCoor.y * Chunk.tileSize + camFocus.y;

    this.ctx.fillRect(x, y, Chunk.tileSize, Chunk.tileSize);
    this.ctx.beginPath();;
    this.ctx.rect(x,y, Chunk.tileSize, Chunk.tileSize);
    this.ctx.stroke();


    //selected tile
    if(Store.selectedTileID > -1){
      this.ctx.fillStyle = "#f335";
      this.ctx.strokeStyle="#f00";
      let tile = Store.tiles[Store.selectedTileID];

      let x = tile.x * Chunk.tileSize + camFocus.x;
      let y = tile.y * Chunk.tileSize + camFocus.y;

      this.ctx.fillRect(x, y, Chunk.tileSize, Chunk.tileSize);
      this.ctx.beginPath();;
      this.ctx.rect(x,y, Chunk.tileSize, Chunk.tileSize);
      this.ctx.stroke();
    }
  }
}
