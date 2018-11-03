//ruler lines for the editor viewport
class EditorRuler{
  constructor(size){
    this.size = size; //distance between lines
  }

  draw(vp){
    let camFocus = vp.getWorldFocus();
    let vpSize = vp.VPCoorToWorldCoor(vp.width, vp.height);


    //vertical lines
    let maxLinesX = vpSize.x/Chunk.tileSize; //number of lines needed from left to right
    let maxX = parseInt((maxLinesX/2) + 1); //number of lines half of the screen
    let offsetX = parseInt(vp.camera.position.x / Chunk.tileSize); //camera offset for lines

    for(let i = -maxX-offsetX; i <= maxX-offsetX; i++){
      vp.ctx.beginPath();
      this.setRulerStyle(i, vp);
      let x = camFocus.x + (i*Chunk.tileSize);
      vp.ctx.moveTo(x, 0);
      vp.ctx.lineTo(x, vpSize.y);
      vp.ctx.stroke();
    }



    //horizontal lines
    let maxLinesY= vpSize.y/Chunk.tileSize;
    let maxY = parseInt((maxLinesY/2) + 1);
    let offsetY = parseInt(vp.camera.position.y / Chunk.tileSize);

    for(let i = -maxY-offsetY; i <= maxX-offsetY; i++){
      vp.ctx.beginPath();
      this.setRulerStyle(i, vp);
      vp.ctx.beginPath();
      let y = camFocus.y + (i*Chunk.tileSize);
      vp.ctx.moveTo(0, y);
      vp.ctx.lineTo(vpSize.x, y);
      vp.ctx.stroke();
    }
  }

  //style for different lines
  setRulerStyle(index, vp){
    if(index == 0){
      vp.ctx.lineWidth = 3;
      vp.ctx.strokeStyle = '#fff';
    }
    else if(index % Chunk.size == 0){
      vp.ctx.lineWidth = 3;
      vp.ctx.strokeStyle = '#efefef77';
    }
    else{
      vp.ctx.lineWidth = 1;
      vp.ctx.strokeStyle = '#efefef55';
    }
  }
}
