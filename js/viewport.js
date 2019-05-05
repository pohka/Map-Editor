
class Viewport
{
  constructor(id)
  {
    this.canvas = document.getElementById(id);
    if(this.canvas == null)
    {
      console.log("Canvas element not found: " + id);
    }
    let computedStyle = window.getComputedStyle(this.canvas);
    this.width = parseInt(computedStyle.width);
    this.height = parseInt(computedStyle.height);

    //set canvas size based on computed style
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.ctx = this.canvas.getContext("2d");
    this.zoom = 1.5;
    this.ruler = new Ruler();
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

    this.clear();
  }

  //converts viewport coordinates to world coordinates
  VPCoorToWorldCoor(x,y)
  {
    return new Vector(x / this.zoom, y / this.zoom);
  }

  //returns the focus point of the viewport in world coordinates
  getWorldFocus()
  {
    let camOffset = this.VPCoorToWorldCoor(this.width/2, this.height/2);
    return new Vector(
      this.camPos.x + camOffset.x,
      this.camPos.y + camOffset.y
    );
  }

  //returns the cursors world position
  getCursorWorldPos(cursorX, cursorY)
  {
    let rect = this.canvas.getBoundingClientRect();
    let cursorViewportPos = new Vector(
        cursorX - rect.left,
        cursorY - rect.top
      );
      //console.log("cursorVPpos", cursorViewportPos)

    let mousePos = this.VPCoorToWorldCoor(cursorViewportPos.x, cursorViewportPos.y);

    let camFocus = this.getWorldFocus();
///console.log("camFocus", camFocus)
    let mouseWorldPos = new Vector(mousePos.x - camFocus.x, -(mousePos.y - camFocus.y) );

    //console.log("mouseWorldPos", mouseWorldPos)
    return mouseWorldPos;
  }

  clear()
  {
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
  isCursorOverViewport(clientX, clientY)
  {
    let rect = this.canvas.getBoundingClientRect();
    let x = clientX;
    let y= clientY;

    return (
      rect.x <= x && x <= rect.x + rect.width &&
      rect.y <= y && y <= rect.y + rect.height
    );
  }

  //zooming and panning input
  addCameraInput()
  {
    let vp = this;
    vp.canvas.addEventListener('mousedown',function(e){
      if(e.button == 1)
      { //middle mouse button
        vp.isPanning=true;
        vp.panLastPos = new Vector(e.x,e.y);
        vp.draw();
      }
    });


    document.addEventListener("mousemove", function(e){
      vp.lastCursorPos.set(e.clientX, e.clientY);
      let isOverViewport = vp.isCursorOverViewport(e.clientX, e.clientY);

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
    });

    document.addEventListener('mouseup',function(e){
      if(e.button == 1)
      {
        vp.isPanning=false;
      }
    });

    vp.canvas.addEventListener('wheel', function(e){
      //prevent multiple scroll events
      let now = Date.now();
      if(now - vp.lastZoomTime > 50){

        vp.lastZoomTime = now;

        if(e.deltaY > 0)
        { //scroll down
          if(vp.zoom - vp.zoomRate >= vp.zoomMin)
          {
            vp.zoom -= vp.zoomRate;
          }

        }
        else
        { //scroll up
          if(vp.zoom + vp.zoomRate <= vp.zoomMax){
            vp.zoom += vp.zoomRate;
          }
        }

        vp.draw();
      }
    },false);
  }

  drawTileHighligher(camFocus)
  {
    let mousePos = this.getCursorWorldPos(this.lastCursorPos.x, this.lastCursorPos.y);
    let tileCoor = new Vector(
      Math.floor(mousePos.x/MapData.tile_size),
      -Math.ceil(mousePos.y/MapData.tile_size),
    );

    this.ctx.fillStyle = "#ccc6";
    this.ctx.strokeStyle="#fff";

    let x = tileCoor.x * MapData.tile_size + camFocus.x;
    let y = tileCoor.y * MapData.tile_size + camFocus.y;

    this.ctx.fillRect(x, y, MapData.tile_size, MapData.tile_size);
    this.ctx.beginPath();;
    this.ctx.rect(x,y, MapData.tile_size, MapData.tile_size);
    this.ctx.stroke();
  }

  //pass object with the x and y position of point a,b and c on the triangle
  drawTriangle(points)
  {
    this.ctx.beginPath();
    this.ctx.moveTo(points.ax, points.ay);
    this.ctx.lineTo(points.bx, points.by);
    this.ctx.lineTo(points.cx, points.cy);
    this.ctx.lineTo(points.ax, points.ay);
    this.ctx.stroke();
    this.ctx.fill();
  }

  //draws collision in the viewport based on the collision type
  drawCollisionShape(type, x, y, w, h)
  {
    if(type == CollisionType.box)
    {
      this.ctx.beginPath();
      this.ctx.fillRect(x, y, w, h);
      this.ctx.rect(x, y, w, h);
      this.ctx.stroke();
    }
    else if(type == CollisionType.topLeft)
    {
      let points = {
        ax : x,
        ay : y,
        bx : x + w,
        by : y,
        cx : x,
        cy : y + h
      };

      this.drawTriangle(points);
    }
    else if(type == CollisionType.topRight)
    {
      let points = {
        ax : x,
        ay : y,
        bx : x + w,
        by : y,
        cx : x + w,
        cy : y + h
      };

      this.drawTriangle(points);
    }
    else if(type == CollisionType.bottomRight)
    {
      let points = {
        ax : x + w,
        ay : y,
        bx : x + w,
        by : y + h,
        cx : x,
        cy : y + h
      };

      this.drawTriangle(points);
    }
    else if(type == CollisionType.bottomLeft)
    {
      let points = {
        ax : x + w,
        ay : y + h,
        bx : x,
        by : y + h,
        cx : x,
        cy : y
      };

      this.drawTriangle(points);
    }
  }
}
