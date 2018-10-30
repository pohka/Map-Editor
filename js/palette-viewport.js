//palette canvas
class PaletteViewport extends Viewport{
  constructor(id, width, height){
    super(id, width, height, new PaletteRuler(32), "#777");
    this.img = null;
    this.camera = new PaletteCamera(this);
  }

  //set the current image of the palette
  setImg(path){
    this.img = Store.findImgObj(path);
  }

  draw(){
    super.draw();
    if(this.img != null){
      this.ctx.drawImage(this.img, 0, 0);
    }

    this.ruler.draw(this);
  }
}
