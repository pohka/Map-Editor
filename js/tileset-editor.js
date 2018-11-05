
class TilesetEditor extends Viewport{
  constructor(id, w, h){
    super(id, w, h);
    this.addInput();
  }

  addInput(){
    let vp = this;

    vp.canvas.addEventListener("mousedown", function(e){
      let mousePos = vp.getCursorWorldPos(e.clientX, e.clientY);
      let tileCoor = new Vector(
        Math.floor(mousePos.x/Chunk.tileSize),
        -Math.ceil(mousePos.y/Chunk.tileSize),
      );

      let tileID = Store.findTileID(Store.selected.palette, tileCoor.x, tileCoor.y);
      if(tileID > -1){
        Store.tiles[tileID].collision = Store.selected.collisionType;
      }

      console.log(tileID, Store.selected.collisionType);

    });
  }

  getTileIDsOfSelectedTileset(){
    let ids = [];
    for(let id in Store.tiles){
      if(Store.tiles[id].src == Store.selected.palette){
        ids.push(id);
      }
    }
    return ids;
  }

  draw(){
    super.clear();
    let camFocus = this.getWorldFocus();

    let img = this.img = Store.findImgObj(Store.selected.palette);
    if(img != null){
      let imgPos = new Vector(0, 0);

      this.ctx.drawImage(this.img, imgPos.x + camFocus.x, -imgPos.y + camFocus.y);

      if(Store.isCollisionVisible){
        this.drawCollision(camFocus, imgPos);
      }
    }

    if(Store.isRulersVisible){
      this.ruler.draw(this);
    }

    this.drawTileHighligher(camFocus);
  }

  drawCollision(camFocus, imgPos){
    let ids = this.getTileIDsOfSelectedTileset();
    let w = Chunk.tileSize;
    let h = Chunk.tileSize;
    this.ctx.fillStyle="#0F05";
    this.ctx.strokeStyle="#0F0";
    this.ctx.lineWidth="1";

    for(let i=0; i<ids.length; i++){
      let id = ids[i];
      if(Store.tiles[id].collision > 0){
        let tile = Store.tiles[id];
        let x = imgPos.x + tile.x * Chunk.tileSize + camFocus.x;
        let y = -imgPos.y + tile.y * Chunk.tileSize + camFocus.y;


        this.ctx.beginPath();
        this.ctx.fillRect(x, y, w, h);
        this.ctx.rect(x, y, w, h);
        this.ctx.stroke();
      }
    }
  }
}
