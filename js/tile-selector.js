
class TileSelector extends Viewport{
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

        let tileID = Store.findTileID(Store.selected.palette, tileCoor.x, tileCoor.y);
        if(tileID > -1){
          Store.selected.tileID = tileID;
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

    let img = this.img = Store.findImgObj(Store.selected.palette);
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
    this.drawTileHighligher(camFocus);

    //selected tile
    if(Store.selected.tileID > -1){
      let tile = Store.getTileByID(Store.selected.tileID);

      this.ctx.fillStyle = "#f335";
      this.ctx.strokeStyle="#f00";


      let x = tile.x * Chunk.tileSize + camFocus.x;
      let y = tile.y * Chunk.tileSize + camFocus.y;

      this.ctx.fillRect(x, y, Chunk.tileSize, Chunk.tileSize);
      this.ctx.beginPath();;
      this.ctx.rect(x,y, Chunk.tileSize, Chunk.tileSize);
      this.ctx.stroke();
    }
  }
}
