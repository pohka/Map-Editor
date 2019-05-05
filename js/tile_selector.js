
class TileSelector extends Viewport
{
  constructor(id)
  {
    super(id);
    this.addInput();
    let camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    this.camPos.x -= camOffset.x;
    this.camPos.y -= camOffset.y;
    this.ruler.useThickLines = false;
  }

  addInput()
  {
    let vp = this;
    vp.canvas.addEventListener("mousedown",function(e){
      //left mouse button
      if(e.button == 0){
        vp.draw();
      }
    });

    document.addEventListener("mousemove", function(e){
      vp.lastCursorPos.set(e.clientX, e.clientY);
      let isOverViewport = vp.isCursorOverViewport(e.clientX, e.clientY);

      if(isOverViewport)
      {
        if(vp.isPanning)
        {
          let xDiff = e.x - vp.panLastPos.x;
          let yDiff = e.y - vp.panLastPos.y;

          let diff = vp.VPCoorToWorldCoor(xDiff, yDiff);

          vp.camPos.moveBy(diff.x, diff.y);

          vp.panLastPos.x = e.x;
          vp.panLastPos.y = e.y;
        }

        vp.draw();
      }
    });
  }

  draw()
  {
    super.clear();
    let camFocus = this.getWorldFocus();
    let path = MapData.dir + "res/"+ States.current.tileset;
    let img = States.findImgObjBySrc(path);
    if(img != null)
    {
      this.ctx.drawImage(img, camFocus.x, camFocus.y);
    }

    if(States.isRulersVisible)
    {
      this.ruler.draw(this);
    }


    this.drawTileHighligher(camFocus);
  }
}
