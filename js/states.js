/** stores temporary data for UI in the app */
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
      active : "",
      options : [
        {
          name : "explorer",
          text : "Explorer",
          id : "window-explorer"
        }
      ]
    },
    {
      id : "menu-middle",
      active : "",
      options : [
        {
          name : "map",
          text : "Map",
          id : "window-map", //domID
          viewport : "map" //key name of the viewport
        },
        {
          name : "tile-nav",
          text : "Tile Nav",
          id : "window-tile-nav",
          viewport : "tileNav" 
        },
        {
          name : "prefab",
          text : "Prefab",
          id : "window-prefab"
        }
      ]
    },
    {
      id : "menu-right",
      active : "",
      options : [
        {
          name : "tile-palette",
          text : "Tile Palette",
          id : "window-tile-palette",
          viewport : "tilePalette"
        }
      ]
    },
    {
      id : "menu-right-bottom",
      active : "",
      options : [
        {
          name : "layers",
          text : "Layers",
          id : "window-layers"
        }
      ]
    }
  ],

  visibleLayers :
  {
    "base" : true
  },

  projectPath : null,
  projectFileName : ""
};

//e.g. findImgObjBySrc("sample.png") will find image in /res/sample.png
/** find image object by src, returns null if not found
  * @param {string} src - path to image relative to the resource folder
  * @return {Image|null}
  */
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

/** find image object by texture id, returns null if not found
 * @param {number} texID - texture id
 * @return {Image|null}
 */
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

/** set States.current.tileset
 * @param {number} texID - texture id
 */
States.setTileSet = function(texID)
{
  States.current.tileset = texID;
  viewports.tilePalette.centerCam();
  viewports.tilePalette.draw();
}

/** set States.current.tile
 * @param {number} id - tile ID
 */
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
