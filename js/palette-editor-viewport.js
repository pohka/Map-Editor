class PaletteEditorViewport extends Viewport{
  constructor(id, w, h){
    super(id, w, h, new PaletteEditorRuler(), "#777");
  }

  draw(){
    super.draw();
    let img = this.img = Store.findImgObj(Store.selectedPalette);
    if(img != null){
      this.ctx.drawImage(this.img, 0, 0);
    }
    this.ruler.draw(this);
  }
}
