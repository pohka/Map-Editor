//data for the map which will be saved to file
var MapData = {
  version : VERSION,
  tile_size : 0, //tile size in pixels
  chunk_size : 0, //tiles per chunk
  chunk_total_size : 1,
  tile_count : 0,
  texture_count : 0,

  //layers for draw order of tiles and sprites
  draw_layers :
  [
  //  "base"
  ],

  textures :
  [
    // { //tex id = 0
    //   //name : "img_1",
    //   id : 0,
    //   src : "tilesets/cave.png",
    // }
  ],

  tilesets : //texture ids which are tilesets
  [
  //  0 //texture ids
  ],

  //tiles ordered by texture key
  tiles :
  [
    // {
    //   id : 0,
    //   tex_id : 0,
    //   tex_x : 0,
    //   tex_y : 0
    // },
    // {
    //   id : 1,
    //   tex_id : 0,
    //   tex_x : 1,
    //   tex_y : 1
    // }
  ],

  chunks:
  [
    // {
    //   x : 0,
    //   y : 0,
    //   layers : 
    //   [
    //     {
    //       name : "base", //layer id
    //       map : Array(32)
    //     }
    //   ],
    //   textures_used : [ 0 ] // array of texture ids
    // }
  ]
};


/** Getters and setters for data within MapData */
var MapQuery = {};

/** Add a new tile
 * @param {number} texID - textureID
 * @param {number} texX - x position in tile coords
 * @param {number} texY - y position in tile coords
 */
MapQuery.addTile = function(texID, texX, texY, navType)
{
  MapData.tiles.push({
    id : MapData.tile_count,
    tex_id : texID,
    tex_x : texX,
    tex_y : texY,
    nav : navType
  });
  MapData.tile_count++;
}

/** returns a chunk with a matching chunk coordinate, returns null if no match is found
 * 
 * @param {number} x - x position in chunk coordinates
 * @param {number} y - y position in chunk coordinates
 * @return {Chunk|null}
*/
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

/** returns the chunk that contains the world position, returns null if no match is found
 * @param {Viewport} vp - viewport
 * @param {number} worldX - x position in world coordinates
 * @param {number} worldY - y position in world coordinates
 * 
 * @return {Chunk|null}
 */
MapQuery.findChunkAtWorldPos = function(vp, worldX, worldY)
{
  let chunkCoor = vp.worldCoorToChunkCoor(worldX, worldY);
  let chunk = MapQuery.findChunkByChunkCoor(chunkCoor.x, chunkCoor.y);
  return chunk;
}

/**find a tile with the matching coordintates and src img. returns -1 if not found
  * @param {number} texID - textureID
  * @param {number} texX - x position in tile coords
  * @param {number} texY - y position in tile coords
  * 
  * @return {number} - id
*/
MapQuery.findTileID = function(texID, texX, texY)
{
  for(let i in MapData.tiles)
  {
    if(
      MapData.tiles[i].tex_x == texX &&
      MapData.tiles[i].tex_y == texY &&
      MapData.tiles[i].tex_id == texID
    ){
      return MapData.tiles[i].id;
    }
  }
  return -1;
}

/** returns a vector of a chunks starting position in world coordinates
 * 
 * @param {Chunk} chunk 
 * @return {Vector}
 */
MapQuery.getChunkOffset = function(chunk){
  return new Vector(
    chunk.x * MapData.chunk_total_size,
    -chunk.y * Chunk.chunk_total_size
  );
}

/** converts world coordinates to tile coordinates, returns null if tile is not within the given chunk
 * 
 * @param {Chunk} chunk - the chunk to search within
 * @param {number} worldX - x position in world coordinates
 * @param {number} worldY - y position in world coordinates
*/
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

/** find a layer in a chunk by name, returns null if not found
 * 
 * @param {Chunk} chunk
 * @param {string} name - layer name
 * @return {Layer|null}
 */
MapQuery.getChunkLayerByName = function(chunk, name)
{
  for(let i=0; i<chunk.layers.length; i++)
  {
    if(chunk.layers[i].name == name)
    {
      return chunk.layers[i];
    }
  }
  return null;
}

/** find a tile by id, returns null if not found
 * 
 * @param {number} id - tile id
 * @return {Tile|null}
 */
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

/** find a texture by id, returns null if not found
 * 
 * @param {number} id - texture id
 * @return {Texture|null}
 */
MapQuery.findTextureByID = function(texID)
{

  for(let i=0; i<MapData.textures.length; i++)
  {
    if(MapData.textures[i].id == texID)
    {
      return MapData.textures[i];
    }
  }
  return null;
}

/** find a texture by source, returns null if not found
 * 
 * @param {string} src - path in relation to the resources folder
 * @return {Texture|null}
 */
MapQuery.findTextureBySrc = function(src)
{
  for(let i=0; i<MapData.textures.length; i++)
  {
    if(MapData.textures[i].src == src)
    {
      return MapData.textures[i];
    }
  }
  return null;
}
