//deals with the input for the viewport
class EditorCamera{
  constructor(vp){
    this.position = new Vector(0,0);
    this.isPanning = false; //panning flag
    this.isPainting = false; //painting flag
    this.addInput(vp);
    this.lastCursorPos = new Vector(0,0); //cursor position in document coordinates
    this.lastZoomTime = Date.now();
    this.zoomMax = 1.5;
    this.zoomMin = 0.5;
    this.zoomRate = 0.25;
  }

  //adds input listeners
  addInput(vp){
    let cam = this;
    vp.canvas.addEventListener('mousedown',function(e){
      if(e.button == 1){ //middle mouse button
        cam.isPanning=true;
        cam.panLastPos = new Vector(e.x,e.y);
      }

      //left mouse button
      if(e.button == 0){
          cam.isPainting = true;
          Tools.setTileAtCursor(e, vp, Store.curTileID);
      }

      vp.draw();
    });


    document.addEventListener("mousemove", function(e){
      cam.lastCursorPos.set(e.clientX, e.clientY);
      let isOverViewport = vp.isCursorOverViewport(e.clientX, e.clientY);

      if(cam.isPanning){

        let xDiff = e.x - cam.panLastPos.x;
        let yDiff = e.y - cam.panLastPos.y;

        let diff = vp.VPCoorToWorldCoor(xDiff, yDiff);

        cam.position.moveBy(diff.x, diff.y);

        cam.panLastPos.x = e.x;
        cam.panLastPos.y = e.y;
      }
      else if(cam.isPainting && isOverViewport){
        Tools.setTileAtCursor(e, vp, Store.curTileID);
      }

      vp.draw();
    });

    document.addEventListener('mouseup',function(e){
      if(e.button == 1){
        cam.isPanning=false;
      }
      if(e.button == 0){
        cam.isPainting = false;
      }
    });

    vp.canvas.addEventListener('wheel', function(e){
      //prevent multiple scroll events
      let now = Date.now();
      if(now - cam.lastZoomTime > 50){

        cam.lastZoomTime = now;

        if(e.deltaY > 0){ //scroll down
          if(vp.zoom - cam.zoomRate >= cam.zoomMin){
            vp.zoom -= cam.zoomRate;
          }

        }
        else{ //scroll up
          if(vp.zoom + cam.zoomRate <= cam.zoomMax){
            vp.zoom += cam.zoomRate;
          }
        }

        vp.draw();
      }
    },false);
  }
}
