
class TileSelector extends Viewport
{
  constructor(id)
  {
    super(id);
    this.addInput();
    this.camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    this.camPos.x -= this.camOffset.x;
    this.camPos.y -= this.camOffset.y;
    this.ruler.useThickLines = false;
  }

  addInput()
  {
    let vp = this;
    vp.canvas.addEventListener("mousedown",function(e){
      //left mouse button
      if(e.button == 0){
        let mousePos = vp.getCursorWorldPos(e.clientX, e.clientY);
        let tileCoor = new Vector(
          Math.floor(mousePos.x/MapData.tile_size),
          -Math.ceil(mousePos.y/MapData.tile_size),
        );

        let tileID = MapQuery.findTileID(States.current.tileset, tileCoor.x, tileCoor.y);
        if(tileID > -1){
          Tools.selectTool("brush");
          States.setTileID(tileID);
          //States.current.tileID = tileID;
        }
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

    if(States.current.tileset > -1)
    {
      let texture = MapQuery.findTextureByID(States.current.tileset);
      let path = MapData.dir + resDir + texture.src;
      let img = States.findImgObjBySrc(path);
      if(img != null)
      {
        this.ctx.drawImage(img, camFocus.x, camFocus.y);
      }
    }

    if(States.isRulersVisible)
    {
      this.ruler.draw(this);
    }


    this.drawTileHighligher(camFocus);
  }

  centerCam()
  {
    this.camPos.x = -this.camOffset.x;
    this.camPos.y = -this.camOffset.y;
    this.zoom = 1.5;
  }
}
