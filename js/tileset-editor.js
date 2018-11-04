
class TilesetEditor extends BetterVP{
  constructor(id, w, h){
    super(id, w, h);
  }

  getTileIDsOfSelectedTileset(){
    let ids = [];
    for(let id in Store.tiles){
      if(Store.tiles[id].src == Store.selectedPalette){
        ids.push(id);
      }
    }
    return ids;
  }

  draw(){
    super.clear();
    let camFocus = this.getWorldFocus();

    let img = this.img = Store.findImgObj(Store.selectedPalette);
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
      if(Store.tiles[id].hasCollision){
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
