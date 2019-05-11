
class Layers
{
  static init()
  {
    Layers.updateList();
  }

  //onclick for layer visiblity
  static toggleVisibilityClick(el)
  {
    let name = el.parentNode.getAttribute("name");
    let nextIsVisible = !States.visibleLayers[name];
    let action = Action.newLayerVisiblilityAction(name, nextIsVisible);
    Action.executeAction(action);
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
          let a = Action.newMoveLayerAction(name, i, i-1);
          Action.executeAction(a);
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
          let a = Action.newMoveLayerAction(name, i, i+1);
          Action.executeAction(a);
        }
      }
    }
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
        '<div class="layer-btn btn far '+visibleClass+'" onclick="Layers.toggleVisibilityClick(this)"></div>' +
        '<div class="layer-btn btn fas fa-arrow-up" onclick="Layers.moveUp(this)"></div>' +
        '<div class="layer-btn btn fas fa-arrow-down" onclick="Layers.moveDown(this)"></div>' +
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

  //onclick function
  static addLayerClick()
  {
    if(States.isProjectLoaded)
    {
      let input = document.getElementById("add-layer-input");
      //Layers.addLayer(input.value);

      //validate input
      let name = Layers.validateLayerName(input.value);
      //length > 0
      if(name.length <= 0)
      {
        Notification.add("Invalid layer name", true);
      }
      else
      {
        //check to see if the name is unique
        let hasMatch = false;
        for(let i=0; i<MapData.draw_layers.length && !hasMatch; i++)
        {
          if(MapData.draw_layers[i] == name)
          {
            hasMatch = true;
            Notification.add("A layer already exists with this name", true);
          }
        }

        //success: layerName is a unique name
        if(!hasMatch)
        {
          let action = Action.newAddLayerAction(name);
          Action.executeAction(action);
        }
      }
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
            name : name,
            map : emptyMap
          });
        }

        States.visibleLayers[name] = true;
        States.current.layer = name;
        Notification.add("Added layer '"+name+"'");

        Layers.updateList();
      }
    }
  }

  static deleteLayer(name)
  {
    let hasMatch = false;
    for(let i=0; i<MapData.draw_layers.length && !hasMatch; i++)
    {
      if(MapData.draw_layers[i] == name)
      {
        hasMatch = true;
        MapData.draw_layers.splice(i, 1);
      }
    }

    if(hasMatch)
    {
      //delete layer in chunks
      for(let a=0; a<MapData.chunks.length; a++)
      {
        let isFound = false;
        for(let b=0; b<MapData.chunks[a].layers.length && !isFound; b++)
        {
          if(MapData.chunks[a].layers[b].name == name)
          {
            MapData.chunks[a].layers.splice(b, 1);
            isFound = true;
          }
        }
      }

      //delete visible state
      if (name in States.visibleLayers)
      {
        delete States.visibleLayers[name];
      }

      //if current layer, set the current layer to null
      if(States.current.layer == name)
      {
        States.current.layer = null;
      }
    }

    Layers.updateList();
    mapViewport.draw();

    console.log("Deleted layer successfully '"+name+"'");
  }
}

