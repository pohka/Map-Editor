
class BetterVP{
  constructor(id, width, height){
    this.canvas = document.getElementById(id);
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.zoom = 1;
    this.ruler = new BetterRuler();
    this.fillStyle = "#777";

    //used for input
    this.camPos = new Vector(0,0);
    this.isPanning = false;
    this.lastCursorPos = new Vector(0,0); //cursor position in document coordinates
    this.lastZoomTime = Date.now();
    this.zoomMax = 4;
    this.zoomMin = 0.5;
    this.zoomRate = 0.5;
    this.addCameraInput();
  }

  //converts viewport coordinates to world coordinates
  VPCoorToWorldCoor(x,y){
    return new Vector(x / this.zoom, y / this.zoom);
  }

  //returns the focus point of the viewport in world coordinates
  getWorldFocus(){
    let camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    return new Vector(this.camPos.x + camOffset.x, this.camPos.y + camOffset.y);
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

  clear(){
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
    let vpWorldPos = new Vector(-this.camPos.x - vpSize.x/2, -this.camPos.y - vpSize.y/2);

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

  //zooming and panning input
  addCameraInput(){
    let vp = this;
    vp.canvas.addEventListener('mousedown',function(e){
      if(e.button == 1){ //middle mouse button
        vp.isPanning=true;
        vp.panLastPos = new Vector(e.x,e.y);
        vp.draw();
      }
    });


    document.addEventListener("mousemove", function(e){
      vp.lastCursorPos.set(e.clientX, e.clientY);
      let isOverViewport = vp.isCursorOverViewport(e.clientX, e.clientY);

      if(vp.isPanning){
        let xDiff = e.x - vp.panLastPos.x;
        let yDiff = e.y - vp.panLastPos.y;

        let diff = vp.VPCoorToWorldCoor(xDiff, yDiff);

        vp.camPos.moveBy(diff.x, diff.y);

        vp.panLastPos.x = e.x;
        vp.panLastPos.y = e.y;
      }

      vp.draw();
    });

    document.addEventListener('mouseup',function(e){
      if(e.button == 1){
        vp.isPanning=false;
      }
    });

    vp.canvas.addEventListener('wheel', function(e){
      //prevent multiple scroll events
      let now = Date.now();
      if(now - vp.lastZoomTime > 50){

        vp.lastZoomTime = now;

        if(e.deltaY > 0){ //scroll down
          if(vp.zoom - vp.zoomRate >= vp.zoomMin){
            vp.zoom -= vp.zoomRate;
          }

        }
        else{ //scroll up
          if(vp.zoom + vp.zoomRate <= vp.zoomMax){
            vp.zoom += vp.zoomRate;
          }
        }

        vp.draw();
      }
    },false);
  }
}
