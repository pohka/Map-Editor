//stores temporary states for UI in the app
const States =
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

  imgObjs: [], //current loaded image objects

  //radio button states for grid menus
  menus :
  [
    {
      id : "menu-left",
      active : "explorer"
    },
    {
      id : "menu-middle",
      active : "map"
    },
    {
      
      id : "menu-right",
      active : "tile-selector"
    },
    {
      
      id : "menu-right-bottom",
      active : "draw-layers"
    }
  ],

  visibleLayers :
  {
    "base" : true
  }
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
  for(let i=0; i<States.imgObjs.length; i++)
  {
    if(States.imgObjs[i].getAttribute("src") == src)
    {
      return States.imgObjs[i];
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

  for(let i=0; i<States.imgObjs.length; i++)
  {
    if(States.imgObjs[i].tex_id == texID)
    {
      return States.imgObjs[i];
    }
  }
  return null;

 //  let texture = MapQuery.findTextureByID(id);
 //  if(texture == null)
 //  {
 //    return;
 //  }
 //  let src = texture.src;
 //
 //  let loc = window.location.href.split("/");
 //  loc.splice(-1,1);
 //  let rootpath = loc.join("/");
 //  let fullpath  = MapData.dir + "res/tilesets/" + src;
 //
 //  for(let i=0; i<States.imgObjs.length; i++){
 //    if(States.imgObjs[i].getAttribute("src") == fullpath){
 //      return States.imgObjs[i];
 //    }
 //  }
 //  console.log("warning: img not found ", texName);
 // return null;
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
