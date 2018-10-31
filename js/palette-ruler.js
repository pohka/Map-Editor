//ruler lines for the plaette viewport
class PaletteRuler{
  constructor(size){
    this.size = size;
  }

  draw(vp){
    let maxX = Math.ceil(vp.width / this.size);
    let maxY = Math.ceil(vp.height / this.size);

    vp.ctx.lineWidth = 1;
    vp.ctx.strokeStyle = '#efefefaa';

    //horizontal lines
    for(let y=1; y<maxY; y++){
      vp.ctx.beginPath();
      vp.ctx.moveTo(0, y * this.size);
      vp.ctx.lineTo(vp.width, y * this.size);
      vp.ctx.stroke();
    }

    //vertical lines
    for(let x=1; x<maxX; x++){
      vp.ctx.beginPath();
      vp.ctx.moveTo(x * this.size, 0);
      vp.ctx.lineTo(x * this.size, vp.height);
      vp.ctx.stroke();
    }
  }
}
