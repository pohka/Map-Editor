
class Layers
{
  static toggleVisibility(el)
  {
    let name = el.parentNode.getAttribute("name");

    //change icon
    let isVisible = States.visibleLayers[name];
    if(isVisible)
    {
      el.classList.remove("fa-eye");
      el.classList.add("fa-eye-slash");
    }
    else
    {
      el.classList.remove("fa-eye-slash");
      el.classList.add("fa-eye");
    }

    isVisible = !isVisible
    States.visibleLayers[name] = isVisible;
    mapViewport.draw();
  }

  static moveUp(el)
  {
    let name = el.parentNode.getAttribute("name");

    let isFound = false;
    for(let i=0; i<MapData.draw_layers.length && !isFound; i++)
    {
      if(MapData.draw_layers[i] == name)
      {
        isFound = true;
        if(i > 0)
        {
          let temp = MapData.draw_layers[i];
          MapData.draw_layers[i] = MapData.draw_layers[i-1];
          MapData.draw_layers[i-1] = temp;
          Layers.updateList();
          mapViewport.draw();
        }
      }
    }
  }

  static moveDown(el)
  {
    let name = el.parentNode.getAttribute("name");

    let isFound = false;
    for(let i=0; i<MapData.draw_layers.length && !isFound; i++)
    {
      if(MapData.draw_layers[i] == name)
      {
        isFound = true;
        if(i < MapData.draw_layers.length-1)
        {
          let temp = MapData.draw_layers[i];
          MapData.draw_layers[i] = MapData.draw_layers[i+1];
          MapData.draw_layers[i+1] = temp;
          Layers.updateList();
          mapViewport.draw();
        }
      }
    }
  }

  static init()
  {
    Layers.updateList();
  }

  static validateLayerName(val)
  {
    //all lowercase alphanumberic and a single underscore for spaces e.g. my_layer
    val = val.toLowerCase();
    val = val.replace(/\s+/g, "_");
    val = val.replace(/[^a-z0-9_]+/g, "");
    return val.replace(/\_+/g, "_");
  }

  static onInput(el)
  {
    //validate characters on input
    let val = Layers.validateLayerName(el.value);
    el.value = val;
  }

  static updateList()
  {
    let list = document.getElementById("draw-layers-list");

    //clear list
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    for(let i=0; i<MapData.draw_layers.length; i++)
    {
      let name = MapData.draw_layers[i];
      let isVisible = States.visibleLayers[name];
      let visibleClass = "fa-eye";
      if(!isVisible)
      {
        visibleClass = "fa-eye-slash";
      }

      let isActive = (States.current.layer == name);

      let item =
      '<li name="'+name+'" active="'+isActive+'">' +
        '<div class="btn far '+visibleClass+'" onclick="Layers.toggleVisibility(this)"></div>' +
        '<div class="btn fas fa-arrow-up" onclick="Layers.moveUp(this)"></div>' +
        '<div class="btn fas fa-arrow-down" onclick="Layers.moveDown(this)"></div>' +
        '<div class="draw-layer-name" onclick="Layers.layerNameClick(this)">'+name+'</div>' +
      '</li>';

      list.innerHTML += item;
    }
  }

  static layerNameClick(el)
  {
    let name = el.parentNode.getAttribute("name");
    if(name != States.current.layer)
    {
      States.current.layer = name;
      Layers.updateList();
    }
  }

  static addLayerClick()
  {
    if(States.isProjectLoaded)
    {
      let input = document.getElementById("add-layer-input");
      Layers.addLayer(input.value);
    }
  }

  static addLayer(name)
  {
    name = Layers.validateLayerName(name);
    if(name.length <= 0)
    {
      Notification.add("Invalid layer name", true);
    }
    else
    {
      let hasMatch = false;
      for(let i=0; i<MapData.draw_layers.length && !hasMatch; i++)
      {
        if(MapData.draw_layers[i] == name)
        {
          hasMatch = true;
          Notification.add("A layer already exists with this name", true);
        }
      }
      if(!hasMatch)
      {
        //add to top of array because order matters i.e. index 0
        MapData.draw_layers.unshift(name);
        for(let i=0; i<MapData.chunks.length; i++)
        {
          //fill emptyMap with -1
          let emptyMap = [];
          for(let y=0; y<MapData.chunk_size; y++)
          {
            emptyMap.push([]);
            for(let x=0; x<MapData.chunk_size; x++)
            {
              emptyMap[y][x] = -1;
            }
          }

          //order doesnt matter
          MapData.chunks[i].layers.push({
            id : name,
            map : emptyMap
          });
        }

        States.visibleLayers[name] = true;

        Notification.add("Added layer '"+name+"'");

        Layers.updateList();
      }
    }
  }
}

