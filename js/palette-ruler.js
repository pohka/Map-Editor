//ruler lines for the plaette viewport
class PaletteRuler{
  constructor(size){
    this.size = size;
  }

  draw(vp){
    let maxX = Math.ceil(vp.width / Chunk.tileSize);
    let maxY = Math.ceil(vp.height / Chunk.tileSize);

    vp.ctx.lineWidth = 1;
    vp.ctx.strokeStyle = '#efefefaa';

    //horizontal lines
    for(let y=1; y<maxY; y++){
      vp.ctx.beginPath();
      vp.ctx.moveTo(0, y * Chunk.tileSize);
      vp.ctx.lineTo(vp.width, y * Chunk.tileSize);
      vp.ctx.stroke();
    }

    //vertical lines
    for(let x=1; x<maxX; x++){
      vp.ctx.beginPath();
      vp.ctx.moveTo(x * Chunk.tileSize, 0);
      vp.ctx.lineTo(x * Chunk.tileSize, vp.height);
      vp.ctx.stroke();
    }
  }
}
