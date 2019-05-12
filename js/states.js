//stores temporary states for UI in the app
var States =
{
  current :
  {
    tool : "brush",
    layer : null,
    tileID : -1,
    tileset : -1, //id
  },

  isProjectLoaded : false,

  prevTileID : -1,

//ui based variables
  isCollisionVisible : true,
  isRulersVisible : true,

  imgObjs: {}, //current loaded image objects

  //radio button states for grid menus
  menus :
  [
    {
      id : "menu-left",
      active : "explorer",
      starting : "explorer"
    },
    {
      id : "menu-middle",
      active : "map",
      starting : "map"
    },
    {
      
      id : "menu-right",
      active : "tile-selector",
      starting : "tile-selector"
    },
    {
      
      id : "menu-right-bottom",
      active : "draw-layers",
      starting : "draw-layers"
    }
  ],

  visibleLayers :
  {
    "base" : true
  },

  projectPath : null,
  projectFileName : ""
};

//const defaultState = States;


States.setFromLoad = function(path, isFile)
{
  //menus
  for(let i=0; i<States.menus.length; i++)
  {
    if(States.menus[i].starting != States.menus[i].active)
    {
      States.updateMenu(States.menus[i].id, States.menus[i].starting, false);
    }
  }

  //if path is a file
  if(isFile !== undefined && isFile)
  {
    //project path and fileName
    let els = path.replace(/\\/g, "/").split("/");
    States.projectFileName = els.pop();
    States.projectPath = els.join("/") + "/";
  }
  //if path is a directory
  else
  {
    States.projectFileName = "";
    States.projectPath = path + "/";
  }

  //delete old layers and set all new layers visible
  for (var layerName in States.visibleLayers)
  {
    delete States.visibleLayers[layerName];
  }
  for(let i=0; i<MapData.draw_layers.length; i++)
  {
    let key = MapData.draw_layers[i];
    States.visibleLayers[key] = true;
  }

  //current values
  States.current.tool = "brush";
  States.current.tileID = -1;
  if(MapData.tilesets.length > 0)
  {
    States.current.tileset = MapData.tilesets[0];
  }
  else
  {
    States.current.tileset = -1;
  }
  if(MapData.draw_layers.length > 0)
  {
    States.current.layer = MapData.draw_layers[0];
  }
  else
  {
    States.currentLayer = null;
  }

  //other values
  States.prevTileID = -1;
  States.isCollisionVisible = true;
  States.isRulersVisible = true;
  
  //clear imgObjs
  for(var obj in States.imgObjs)
  {
    delete States.imgObjs[obj];
  }

  //load images
  States.loadImages(function(newTextureIDs){
    Explorer.setRoot();

    //generate textures for new image files
    for(let i=0; i<newTextureIDs.length; i++)
    {
      let img = States.findImgObj(newTextureIDs[i]);
      if(img != null)
      {
        let path = fullPathToResPath(img.getAttribute("src"));
        if(path.startsWith("tilesets/"))
        {
          generateTiles(newTextureIDs[i]);
        }
      }
    }

    mapViewport.draw();
    tileSelector.draw();
    Layers.updateList();
    States.isProjectLoaded = true;
    Notification.add("Project loaded: " + States.projectFileName);
  });
}

States.loadMenus = function()
{
  for(let i=0; i<States.menus.length; i++)
  {
    States.updateMenu(States.menus[i].id, States.menus[i].active, true);
    let menuDOM = document.getElementById(States.menus[i].id);
    if(menuDOM === undefined || menuDOM == null)
    {
      console.log("menu DOM element not found for menuID:", States.menus[i].id);
    }
    let menuItems = menuDOM.getElementsByClassName("menu-item")
    if(menuItems.length == 0)
    {
      console.log("no menu items found for menuID:", States.menus[i].id);
    }

    let menuID = States.menus[i].id;
    for(let a=0; a<menuItems.length; a++)
    {
      let itemName = menuItems[a].getAttribute("name");
      menuItems[a].setAttribute("onclick", "States.menuItemClicked('"+itemName+"','"+menuID+"')");
    }
  }
}

States.updateMenu = function(menuID, activeName, isFirstTime)
{
  let hasFoundMenuID = false;
  for(let i=0; i<States.menus.length && !hasFoundMenuID; i++)
  {
    if(menuID == States.menus[i].id)
    {
      hasFoundMenuID = true;

      //don't update if its the same menu option, exeption case for first time loaded
      if(isFirstTime || States.menus[i].active != activeName)
      {
        let menuDOM = document.getElementById(States.menus[i].id);
        if(menuDOM === undefined || menuDOM == null)
        {
          console.log("menu DOM element not found for menuID:", States.menus[i].id);
        }
        else
        {
          let menuItems = menuDOM.getElementsByClassName("menu-item")
          if(menuItems.length == 0)
          {
            console.log("no menu items found for menuID:", States.menus[i].id);
          }

          States.menus[i].active = activeName;

          //set attribute for menu items, only 1 per menu can be active
          //behaves similarly to radio buttons
          let isFound = false;
          for(let a=0; a<menuItems.length; a++)
          {
            if(isFound)
            {
              menuItems[a].setAttribute("active", false);
            }
            else
            {
              let hasMatchingName = (menuItems[a].getAttribute("name") == States.menus[i].active);
              menuItems[a].setAttribute("active", !isFound && hasMatchingName);
              if(!isFound && hasMatchingName)
              {
                isFound = true;
              }
            }
          }
        }

        
      }
    }
  }
}

States.menuItemClicked = function(itemName, menuID)
{
  States.updateMenu(menuID, itemName, false);
}

States.findImgObjBySrc = function(src){
  for(let id in States.imgObjs)
  {
    if(States.imgObjs[id].getAttribute("src") == src)
    {
      return States.imgObjs[id];
    }
  }
  return null;
}

//find the image object with the matching path in /res/ folder
//e.g. findImgObj("sample.png") will find image in /res/sample.png
States.findImgObj = function(texID){
  if(texID == null){
    return null;
  }

  let res = States.imgObjs[texID];
  if(res !== undefined)
  {
    return res;
  }
  else
  {
    return null;
  }
}

States.setTileSet = function(texID)
{
  States.current.tileset = texID;
  tileSelector.centerCam();
  tileSelector.draw();
}

States.setTileID = function(id)
{
  if(States.current.tileID > -1)
  {
    States.prevTileID = States.current.tileID;
  }
  States.current.tileID = id;
}


States.loadImages = function(onCompleteCallback)
{
  walk(States.projectPath, function(err, files){
      if(err)
      {
        console.log(err);
      }

      let filesLeftToLoad = files.length;
      let newTextureIDs = [];
      //deep copy
      let missingTextures = JSON.parse(JSON.stringify(MapData.textures));

      for(let i in files)
      {
        if(Explorer.isImage(files[i]))
        {
          let src = fullPathToResPath(files[i]);
          let existingTex = MapQuery.findTextureBySrc(src);

          let nextTextureID = null;
          if(existingTex == null)
          {
            nextTextureID = MapData.texture_count;
            MapData.texture_count++;
            newTextureIDs.push(nextTextureID);
          }
          else
          {
            nextTextureID = existingTex.id;
            delete missingTextures[nextTextureID];
          }

          let img = new Image();
          img.onload = function()
          {
            States.imgObjs[nextTextureID] = this;

            img.tex_id = nextTextureID;
            States.imgObjs[States.imgObjs] = this;
            
            if(existingTex == null)
            {
              MapData.textures.push({
              id : nextTextureID,
              src : src
              });

              if(src.startsWith("tilesets/"))
              {
                MapData.tilesets.push(img.tex_id);
              }
            }
            

            filesLeftToLoad--;
            if(filesLeftToLoad == 0)
            {
              //display error for missing image files
              for(let tex in missingTextures)
              {
                console.log(
                  "WARNING: missing texture id:", missingTextures[tex].id, 
                  " src: res/" + missingTextures[tex].src
                  );
                Notification.add("Missing texture: " + missingTextures[tex].src, true);
              }

              onCompleteCallback(newTextureIDs);
            }
          }
          img.src = States.projectPath + Explorer.resFolder + src;
        }
        else
        {
          filesLeftToLoad--;
        }
      }
    }
  );
}

// //returns a chunk with a matching chunk coordinate
// //returns null if no match is found
// States.findChunkByChunkCoor = function(x, y){
//   for(let i=0; i<MapData.chunks.length; i++)
//   {
//     if(MapData.chunks[i].x == x && MapData.chunks[i].y == y)
//     {
//       return MapData.chunks[i];
//     }
//   }
//   return null;
// }
//
// //returns the chunk that contains the world position
// //returns null if no match is found
// States.findChunkAtWorldPos = function(vp, worldX, worldY)
// {
//   let chunkCoor = vp.worldCoorToChunkCoor(worldX, worldY);
//   let chunk = States.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);
//   return chunk;
// }
//
// //find a tile with the matching coordintates and src img
// //returns -1 if not found
// States.findTileID = function(src, x, y)
// {
//   // for(let i in Store.tiles)
//   // {
//   //   if(Store.tiles[i].x == x && Store.tiles[i].y == y && Store.tiles[i].src == src){
//   //     return Store.tiles[i].id;
//   //   }
//   // }
//   return -1;
// }
