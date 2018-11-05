
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
        console.log(tileID);
      }
    });
  }

  draw(){
    super.clear();

    let img = this.img = Store.findImgObj(Store.selectedPalette);
    if(img != null){
      let camFocus = this.getWorldFocus();
      let imgPos = new Vector(0, 0);
      this.ctx.drawImage(this.img, imgPos.x + camFocus.x, -imgPos.y + camFocus.y);
    }

    this.ruler.draw(this);
  }
}
