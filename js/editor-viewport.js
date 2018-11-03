//editor viewport
class EditorViewport extends Viewport{
  constructor(id, width, height){
    super(id, width, height, new EditorRuler(32), "#bababa");
    this.camera = new EditorCamera(this);
  }

  //converts world coordinates to chunk coordinates
  worldCoorToChunkCoor(worldX, worldY){
    return new Vector(
      Math.floor(worldX/Chunk.totalSize),
      Math.ceil(worldY/Chunk.totalSize)
    );
  }

  draw(){
    super.draw();
    this.drawChunks();
    if(Store.isCollisionVisible){
      this.drawCollision();
    }
    if(Store.isRulersVisible){
      this.ruler.draw(this);
      this.drawChunkPositions();
    }
    this.drawHUD();
  }

  //draws all the chunks
  drawChunks(){
    let camFocus = this.getWorldFocus();
    for(let i=0; i<Store.chunks.length; i++){
      if(this.isChunkInViewPort(Store.chunks[i])){
        Store.chunks[i].draw(this, camFocus);
      }
    }
  }

  //draw collision
  drawCollision(){
    //tile collision
    let camFocus = this.getWorldFocus();
    for(let i=0; i<Store.chunks.length; i++){
      if(this.isChunkInViewPort(Store.chunks[i])){
        Store.chunks[i].drawCollision(this, camFocus);
      }
    }
  }

  //returns true if a chunk is within the viewport
  isChunkInViewPort(chunk){
    return this.isRectInViewPort(
      chunk.position.x * Chunk.totalSize,
      chunk.position.y * Chunk.totalSize,
      Chunk.totalSize, Chunk.totalSize
    );
  }

  //draws the chunk position text
  drawChunkPositions(){
    let camFocus = this.getWorldFocus();
    this.ctx.font = "50px Verdana";
    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "#dfdfdf";

    for(let i=0; i<Store.chunks.length; i++){

      let x = Store.chunks[i].position.x * Chunk.totalSize;
      let y = -Store.chunks[i].position.y * Chunk.totalSize;

      let isInVP = this.isRectInViewPort(
        x, -y, Chunk.totalSize, Chunk.totalSize
      );

      if(isInVP){
        let str = "(" + Store.chunks[i].position.x + "," + (Store.chunks[i].position.y) + ")";
        this.ctx.fillText(str, camFocus.x + x + Chunk.totalSize/2, camFocus.y + y + Chunk.totalSize/2);
      }
    }
  }

  drawHUD(){
    //cursor tile highlighter
    let tileWorldPos = Tools.getTileWorldPosAtCursor(this, this.camera.lastCursorPos.x, this.camera.lastCursorPos.y);
    if(tileWorldPos != null){
      let camFocus = this.getWorldFocus();
      let x = tileWorldPos.x + camFocus.x;
      let y = -tileWorldPos.y + camFocus.y;
      this.ctx.fillStyle = "#ccc6";
      this.ctx.fillRect(x, y, Chunk.tileSize, Chunk.tileSize);
      this.ctx.strokeStyle="#fff";
      this.ctx.beginPath();;
      this.ctx.rect(x,y, Chunk.tileSize, Chunk.tileSize);
      this.ctx.stroke();
    }
  }
}
