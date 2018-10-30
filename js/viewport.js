//the canvas super class
class Viewport{
  constructor(id, width, height, ruler, fillStyle, camera){
    this.canvas = document.getElementById(id);
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.zoom = 1;
    this.ruler = ruler;
    this.camera;
    this.fillStyle = fillStyle;
  }

  //converts viewport coordinates to world coordinates
  VPCoorToWorldCoor(x,y){
    return new Vector(x / this.zoom, y / this.zoom);
  }

  //returns the focus point of the viewport in world coordinates
  getWorldFocus(){
    let camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    return new Vector(this.camera.position.x + camOffset.x, this.camera.position.y + camOffset.y);
  }

  //returns the cursors world position
  getCursorWorldPos(cursorX, cursorY){
    let rect = this.canvas.getBoundingClientRect();
    let cursorViewportPos = new Vector(
        cursorX - rect.left,
        cursorY - rect.top
      );

    let mousePos = this.VPCoorToWorldCoor(cursorViewportPos.x, cursorViewportPos.y);

    let camFocus = this.getWorldFocus();

    let mouseWorldPos = new Vector(mousePos.x - camFocus.x, -(mousePos.y - camFocus.y) );

    return mouseWorldPos;
  }

  draw(){
    //clears the canvas
    this.ctx.setTransform(1,0,0,1,0,0);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.scale(this.zoom, this.zoom);
  }

  //returns true if a world coordinate rect lies within the current view of the viewport
  isRectInViewPort(x, y, w, h){
    let vpSize = this.VPCoorToWorldCoor(this.width, this.height);
    let vpWorldPos = new Vector(-this.camera.position.x - vpSize.x/2, -this.camera.position.y - vpSize.y/2);

    return (
      vpWorldPos.x < x + w &&
      vpWorldPos.x + vpSize.x > x &&
      vpWorldPos.y < -y + h &&
      vpWorldPos.y + vpSize.y > -y
    );
  }

  //returns true if the cursor is over the canvas
  isCursorOverViewport(clientX, clientY){
    let rect = this.canvas.getBoundingClientRect();
    let x = clientX;
    let y= clientY;

    return (
      rect.x <= x && x <= rect.x + rect.width &&
      rect.y <= y && y <= rect.y + rect.height
    );
  }
}
