/** tile selector viewport */
class TileSelector extends Viewport
{
  /**
   * @param {string} id - DOM id 
   */
  constructor(id)
  {
    super(id);
    this.addInput();
    this.camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    this.camPos.x -= this.camOffset.x;
    this.camPos.y -= this.camOffset.y;
    this.ruler.useThickLines = false;
  }

  //add input controls for viewport
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
        }
        vp.draw();
      }
    });
  }

  /** clear and draw viewport */
  draw()
  {
    if(this.isActive)
    {
      super.clear();
      let camFocus = this.getWorldFocus();

      if(States.current.tileset > -1)
      {
        let texture = MapQuery.findTextureByID(States.current.tileset);
        let path = States.projectPath + Explorer.resFolder + texture.src;
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

      this.drawHUD(camFocus);
    }
  }

  /** center the camera so the texture is justified to the top left */
  centerCam()
  {
    this.camPos.x = -this.camOffset.x;
    this.camPos.y = -this.camOffset.y;
    this.zoom = 1.5;
  }

  /** draw HUD
   * @param {Vector} camFocus - current focus point of the camera
   */
  drawHUD(camFocus){
    this.drawTileHighligher(camFocus);
    
    //selected tile
    if(States.current.tileID > -1)
    {
      let tile = MapQuery.findTileByID(States.current.tileID);

      if(tile != null)
      {
        //tile selector is displaying the same tileset
        if(tile.tex_id == States.current.tileset)
        {
          this.ctx.fillStyle = "#f335";
          this.ctx.strokeStyle="#f00";


          let x = tile.tex_x * MapData.tile_size + camFocus.x;
          let y = tile.tex_y * MapData.tile_size + camFocus.y;

          this.ctx.fillRect(x, y, MapData.tile_size, MapData.tile_size);
          this.ctx.beginPath();;
          this.ctx.rect(x,y, MapData.tile_size, MapData.tile_size);
          this.ctx.stroke();
        }
        
      }
    }
  }
}
