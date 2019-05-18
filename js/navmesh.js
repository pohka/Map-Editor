
class NavMesh
{
  static generate()
  {
    NavMesh.chunks = [];
    for(let a=0; a<MapData.chunks.length; a++)
    {
      NavMesh.generateChunk(MapData.chunks[a]); 
    }

    NavMesh.test2();
  }

  static generateChunk(chunk)
  {
    let map = [];

    //fill with not pathable
    for(let i=0; i<MapData.chunk_size; i++)
    {
      let row = [];
      for(let k=0; k<MapData.chunk_size; k++)
      {
        row.push(NavType.NONE);
      }
      map.push(row);
    }

    //iterate through all the maps in the layers for find the navigation type
    for(let b=0; b<chunk.layers.length; b++)
    {
      for(let y=0; y<MapData.chunk_size; y++)
      {
        for(let x=0; x<MapData.chunk_size; x++)
        {
          let tileID = chunk.layers[b].map[y][x];
          let tile = MapQuery.findTileByID(tileID);
          if(tile != null && tile.nav > NavType.NONE)
          {
            map[y][x] = tile.nav;
          }
        }
      }
    }

    NavMesh.chunks.push({
      x : chunk.x,
      y : chunk.y,
      map : map
    });
  }

  //top = 8, right = 4, bottom = 2, left = 1
  static test2()
  {
    let nodes = [];
    for(let y=0; y<MapData.chunk_size; y++)
    {
      let row = [];
      for(let x=0; x<MapData.chunk_size; x++)
      {
        row.push(0);
      }
      nodes.push(row);
    }

    for(let y=0; y<MapData.chunk_size; y++)
    {
      for(let x=0; x<MapData.chunk_size; x++)
      {
        let chunk = NavMesh.chunks[0];
        let nav = chunk.map[y][x];
        let val = 0;
        if(nav == NavType.WALKABLE)
        {
          val = NavMesh.sides.all;
        }
        else if(nav == NavType.NONE)
        {
          let left = (x-1 > 0 && chunk.map[y][x-1] == NavType.WALKABLE);
          let top = (y-1 > 0 && chunk.map[y-1][x] == NavType.WALKABLE);
          let right = (x+1 < MapData.chunk_size && chunk.map[y][x+1] == NavType.WALKABLE);
          let bottom = (y+1 < MapData.chunk_size && chunk.map[y+1][x] == NavType.WALKABLE);
          //let topLeft = (x-1 > 0 && y-1 > 0 && chunk.map[y-1][x-1] == NavType.WALKABLE);
          //let topRight = (x+1 < MapData.chunk_size && y-1 > 0 && chunk.map[y-1][x+1] == NavType.WALKABLE);
          //let bottomLeft = (x-1 > 0 && y+1 < MapData.chunk_size && chunk.map[y+1][x-1] == NavType.WALKABLE);
          //let bottomRight = (x+1 < MapData.chunk_size && y+1 < MapData.chunk_size && chunk.map[y+1][x+1] == NavType.WALKABLE);
          
          //bitwise
          //top = 8, right = 4, bottom = 2, left = 1
          if(top)
          {
            val += NavMesh.sides.top;
          }
          if(right)
          {
            val+= NavMesh.sides.right;
          }
          if(bottom)
          {
            val += NavMesh.sides.bottom;
          }
          if(left)
          {
            val += NavMesh.sides.left;
          }
        }
        nodes[y][x] = val;
      }
    }

    console.log(nodes);
    NavMesh.nodes = nodes;

    NavMesh.lines = [];

    //todo, if has line at bottom and top in same iteration

    //ignore sides of chunk
    for(let y=1; y<MapData.chunk_size-1; y++)
    {
      let hasFoundMesh = false;
      let line;
      let side;
      for(let x=1; x<MapData.chunk_size-1; x++)
      {
        let val = NavMesh.nodes[y][x];
        let tileAbove = NavMesh.nodes[y-1][x];
        let tileBelow = NavMesh.nodes[y+1][x]
        let hasAboveTileBottomEdge = (tileAbove >> 1 & 1);
        let hasBelowTileTopEdge = (tileBelow >> 3 & 1);

        if(val == NavMesh.sides.all && !hasFoundMesh)
        {
          if(hasAboveTileBottomEdge && tileAbove != NavMesh.sides.all)
          {
            side = NavMesh.sides.top;
            hasFoundMesh = true;
            line = {
              x1 : x,
              y1 : y,
              x2 : x+1,
              y2 : y
            };
          }
          else if(hasBelowTileTopEdge && tileBelow != NavMesh.sides.all)
          {
            side = NavMesh.sides.bottom;
            hasFoundMesh = true;
            line = {
              x1 : x,
              y1 : y+1,
              x2 : x+1,
              y2 : y+1
            };
          }
        }

        if(hasFoundMesh)
        {
          if(
            (side == NavMesh.sides.top && (!hasAboveTileBottomEdge || tileAbove == NavMesh.sides.all)) || 
            (side == NavMesh.sides.bottom && (!hasBelowTileTopEdge || tileBelow == NavMesh.sides.all))
          )
          {
            line.x2 = x;
            hasFoundMesh = false;
            NavMesh.lines.push(line);
          }
        }
      }
    }

    console.log("lines:", NavMesh.lines);
  }
}

NavMesh.sidesBitShift = {
  top : 3,
  right : 2,
  bottom : 1,
  left : 0
}
Object.freeze(NavMesh.sidesBit);

NavMesh.sides = {
  top : 8,
  right : 4,
  bottom : 2,
  left : 1,
  all : 15
}



Object.freeze(NavMesh.sides);




NavMesh.chunks = [];
NavMesh.nodes = [];
NavMesh.lines = [];