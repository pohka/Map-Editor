const MapData = {
  project_name : "", //project file name
  dir : "./projects/rework/", //directory of project
  tile_size : 0, //tile size in pixels
  chunk_size : 0, //tiles per chunk
  chunk_total_size : 1,

  //layers for draw order of tiles and sprites
  draw_layers :
  [
    "base"
  ],

  textures :
  [
    { //tex id = 0
      name : "img_1",
      id : 0,
      src : "cave.png",
    }
  ],

  //tiles ordered by texture key
  tiles :
  [
    {
      id : 0,
      tex_name : "img_1",
      tex_x : 0,
      tex_y : 0
    },
    {
      id : 1,
      tex_name : "img_1",
      tex_x : 1,
      tex_y : 1
    }
  ],

  chunks:
  [
    // {
    //   "x" : 0,
    //   "y" : 0  ,
    //   "map" :
    //   [
    //     { "text_id" : 0, "tile_id" : 0, "h" : 0},
    //     { "text_id" : 0, "tile_id" : 0, "h" : 0}
    //   ]
    // }
  ]
};


var MapQuery = {};

//returns a chunk with a matching chunk coordinate
//returns null if no match is found
MapQuery.findChunkByChunkCoor = function(x, y){
  for(let i=0; i<MapData.chunks.length; i++)
  {
    if(MapData.chunks[i].x == x && MapData.chunks[i].y == y)
    {
      return MapData.chunks[i];
    }
  }
  return null;
}

//returns the chunk that contains the world position
//returns null if no match is found
MapQuery.findChunkAtWorldPos = function(vp, worldX, worldY)
{
  let chunkCoor = vp.worldCoorToChunkCoor(worldX, worldY);
  let chunk = MapQuery.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);
  return chunk;
}

//find a tile with the matching coordintates and src img
//returns -1 if not found
MapQuery.findTileID = function(texName, texX, texY)
{
  for(let i in MapData.tiles)
  {
    if(
      Store.tiles[i].tex_x == texX &&
      Store.tiles[i].tex_y == texY &&
      Store.tiles[i].tex_name == texName
    ){
      return Store.tiles[i].id;
    }
  }
  return -1;
}

MapQuery.getChunkOffset = function(chunk){
  return new Vector(
    chunk.x * MapData.chunk_total_size,
    -chunk.y * Chunk.chunk_total_size
  );
}

//converts world coordinates to map indexes
//returns null if tile is not within this chunk
MapQuery.findTileCoorAtWorldPos = function(chunk, worldX, worldY){
  let chunkWorldX = chunk.x * MapData.chunk_total_size;
  let chunkWorldY = chunk.y * MapData.chunk_total_size;

  //difference between the world position and the chunk world start position
  let diffX = worldX - chunkWorldX;
  let diffY = worldY - chunkWorldY;

  let tileX = parseInt(diffX / MapData.tile_size);
  let tileY = -parseInt(diffY / MapData.tile_size);

  //if invalid tile coordinate
  if(tileX < 0 || tileX >= MapData.chunk_size ||
    tileY < 0 || tileY >= MapData.chunk_size){
      console.log(tileX, tileY);
    return null;
  }

  return new Vector(tileX, tileY);
}

MapQuery.getChunkLayerByID = function(chunk, id)
{
  for(let i=0; i<chunk.layers.length; i++)
  {
    if(chunk.layers[i].id == id)
    {
      return chunk.layers[i];
    }
  }
  return null;
}

MapQuery.findTileByID = function(id)
{
  for(let i=0; i<MapData.tiles.length; i++)
  {
    if(MapData.tiles[i].id == id)
    {
      return MapData.tiles[i];
    }
  }
  return null;
}

MapQuery.findTextureByName = function(name)
{
  for(let i=0; i<MapData.textures.length; i++)
  {
    if(MapData.textures[i].name == name)
    {
      return MapData.textures[i];
    }
  }
  return null;
}
