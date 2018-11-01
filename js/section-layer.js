class SectionLayer{
  static addLayer(name){
    let layerName;
    if(name === undefined){
      let input = document.getElementById("layer-name");
      layerName = input.value.trim();
      layerName = layerName.replace(/\s+/g, "-");
    }
    else{
      layerName = name;
    }



    if(Store.layerOrder.length == 0){
      Store.selectedLayer = layerName;
    }

    if(Store.layerOrder.indexOf(layerName) == -1){
      Store.layerOrder.splice(0, 0, layerName);
      for(let i=0; i<Store.chunks.length; i++){
          Store.chunks[i].layers[layerName] = Chunk.getEmptyLayer();
      }

      SectionLayer.updateLayerListDOM();
    }
  }

  static moveLayer(e){
    let curIndex = Store.layerOrder.indexOf(e.name);
    let direction = e.getAttribute("dir");
    if(direction == "up" && curIndex > 0){
      let tmp = Store.layerOrder[curIndex-1];
      Store.layerOrder[curIndex-1] = Store.layerOrder[curIndex];
      Store.layerOrder[curIndex] = tmp;
    }
    else if(direction == "down" && curIndex < Store.layerOrder.length - 1){
      let tmp = Store.layerOrder[curIndex+1];
      Store.layerOrder[curIndex+1] = Store.layerOrder[curIndex];
      Store.layerOrder[curIndex] = tmp;
    }

    //update the DOM
    SectionLayer.updateLayerListDOM();
  }

  //updates the layer section DOM
  static updateLayerListDOM(){
    let list = document.getElementById("layer-list");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    for(let i=0; i<Store.layerOrder.length; i++){
      let el = document.createElement("div");
      let layerName = Store.layerOrder[i];
      el.setAttribute("layer", layerName);
      el.innerHTML = "<span>"+layerName+"</span>"+
                    "<button dir='down' name='"+layerName+"' onclick='SectionLayer.moveLayer(this)'>↓</button>"+
                      "<button dir='up' name='"+layerName+"' onclick='SectionLayer.moveLayer(this)'>↑</button>";

      el.className = "layer-item";
      if(Store.selectedLayer == layerName){
        el.className+=" active";
      }
      else{
        el.addEventListener("click", function(e){
          if(e.button == 0){
            Store.selectedLayer = layerName;
            SectionLayer.updateLayerListDOM();
          }
        });
      }
      list.appendChild(el);
    }
  }

  //only accessable from console, cannot be undone
  static deleteLayer(layerName){
    let index = Store.layerOrder.indexOf(layerName);
    if(index > -1){
      Store.layerOrder.splice(index, 1);
      for(let i=0; i<Store.chunks.length; i++){
        delete Store.chunks[i].layers[layerName]
      }
    }
    if(Store.layerOrder.length > 0){
      Store.selectedLayer = Store.layerOrder[0];
    }
    SectionLayer.updateLayerListDOM();
    editor.draw();
  }
}
