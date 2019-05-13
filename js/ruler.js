/** ruler lines for a viewport */
class Ruler{
  /**
   * @param {boolean} useThickLines 
   */
  constructor(useThickLines)
  {
    this.useThickLines = true;
  }

  /** draw
   * @param {Viewport} vp
   */
  draw(vp)
  {
    let camFocus = vp.getWorldFocus();
    let vpSize = vp.VPCoorToWorldCoor(vp.width, vp.height);


    //vertical lines
    let maxLinesX = vpSize.x/MapData.tile_size; //number of lines needed from left to right
    let maxX = parseInt((maxLinesX/2) + 1); //number of lines half of the screen
    let offsetX = parseInt(vp.camPos.x / MapData.tile_size); //camera offset for lines

    for(let i = -maxX-offsetX; i <= maxX-offsetX; i++)
    {
      vp.ctx.beginPath();
      if(this.useThickLines){
        this.setRulerStyle(i, vp);
      }
      else {
        this.setRulerStyle(-1, vp);
      }
      let x = camFocus.x + (i*MapData.tile_size);
      vp.ctx.moveTo(x, 0);
      vp.ctx.lineTo(x, vpSize.y);
      vp.ctx.stroke();
    }



    //horizontal lines
    let maxLinesY= vpSize.y/MapData.tile_size;
    let maxY = parseInt((maxLinesY/2) + 1);
    let offsetY = parseInt(vp.camPos.y / MapData.tile_size);

    for(let i = -maxY-offsetY; i <= maxX-offsetY; i++)
    {
      vp.ctx.beginPath();
      if(this.useThickLines){
        this.setRulerStyle(i, vp);
      }
      else {
        this.setRulerStyle(-1, vp);
      }
      vp.ctx.beginPath();
      let y = camFocus.y + (i*MapData.tile_size);
      vp.ctx.moveTo(0, y);
      vp.ctx.lineTo(vpSize.x, y);
      vp.ctx.stroke();
    }
  }

  //style for different lines
  setRulerStyle(index, vp)
  {
    if(index == 0)
    {
      vp.ctx.lineWidth = 3;
      vp.ctx.strokeStyle = '#fff';
    }
    else if(index % MapData.chunk_size == 0)
    {
      vp.ctx.lineWidth = 3;
      vp.ctx.strokeStyle = '#efefef77';
    }
    else
    {
      vp.ctx.lineWidth = 1;
      vp.ctx.strokeStyle = '#efefef55';
    }
  }
}
