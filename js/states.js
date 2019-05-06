
const States =
{
  current :
  {
    tool : "brush",
    layer : "0",
    tileID : 0,
    tileset : -1, //id
  },

//ui based variables
  isCollisionVisible : true,
  isRulersVisible : true,

  imgObjs: []
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
