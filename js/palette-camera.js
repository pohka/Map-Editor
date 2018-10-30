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
    document.addEventListener("mousemove", function(e){
      cam.lastCursorPos.set(e.clientX, e.clientY);
    });

    vp.canvas.addEventListener('mousedown',function(e){
      //left mouse button
      if(e.button == 0){
        let rect = vp.canvas.getBoundingClientRect();
        let palettePos = new Vector(
          e.clientX - rect.left,
          e.clientY - rect.top
        );


        Store.curTileID = Math.floor(palettePos.x/32);
      }

      vp.draw();
    });
  }
}
