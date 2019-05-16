class TileNavViewport extends Viewport
{
  
  constructor(id)
  {
    super(id);
    this.addInput();
    this.camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    this.camPos.x -= this.camOffset.x;
    this.camPos.y -= this.camOffset.y;
    this.zoom = 1.5;
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

        //find tile currently selected
        for(let i in MapData.tiles)
        {
          if(
            States.current.tileset == MapData.tiles[i].tex_id &&
            MapData.tiles[i].tex_x == tileCoor.x &&
            MapData.tiles[i].tex_y == tileCoor.y
          )
          {
            //set NavType
            if(MapData.tiles[i].nav == NavType.WALKABLE)
            {
              MapData.tiles[i].nav = NavType.NONE;
            }
            else
            {
              MapData.tiles[i].nav = NavType.WALKABLE;
            }
            
            vp.draw();
            break;
          }
        }
      }
    });
  }

  /** center the camera so the texture is justified to the top left */
  centerCam()
  {
    let texture = MapQuery.findTextureByID(States.current.tileset);
    let path = States.projectPath + Explorer.resFolder + texture.src;
    let img = States.findImgObjBySrc(path);
    if(img != null)
    {
      this.camPos.x = -img.width/2;
      this.camPos.y = -this.camOffset.y + 10;
    }

    this.zoom = 1.5;
  }

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

  drawHUD(camFocus)
  {
    this.drawTileHighligher(camFocus);

    //draw navigation layer
    let texture = MapQuery.findTextureByID(States.current.tileset);
    if(texture != null)
    {
      let img = States.findImgObj(texture.id);
      if(img != null)
      {
        this.ctx.fillStyle = "#f335";
        this.ctx.strokeStyle="#f00";

        for(let i in MapData.tiles)
        {
          if(States.current.tileset == MapData.tiles[i].tex_id)
          {
            if(MapData.tiles[i].nav == NavType.WALKABLE)
            {
              let x = camFocus.x + (MapData.tiles[i].tex_x * MapData.tile_size);
              let y = camFocus.y + (MapData.tiles[i].tex_y * MapData.tile_size);

              this.ctx.fillRect(x, y, MapData.tile_size, MapData.tile_size);
              this.ctx.beginPath();;
              this.ctx.rect(x,y, MapData.tile_size, MapData.tile_size);
              this.ctx.stroke();
            }
          }
        }
      }
    }
  }
}