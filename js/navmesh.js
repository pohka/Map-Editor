
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
          val = 15;
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
            val += 8;
          }
          if(right)
          {
            val+= 4;
          }
          if(bottom)
          {
            val += 2;
          }
          if(left)
          {
            val += 1;
          }
        }
        nodes[y][x] = val;
      }
    }

    console.log(nodes);
    NavMesh.nodes = nodes;
  }

  // static test()
  // {
  //   let nodes = [];
  //   for(let y=0; y<MapData.chunk_size+1; y++)
  //   {
  //     let row = [];
  //     for(let x=0; x<MapData.chunk_size+1; x++)
  //     {
  //       row.push(0);
  //     }
  //     nodes.push(row);
  //   }

  //   for(let y=0; y<MapData.chunk_size; y++)
  //   {
  //     for(let x=0; x<MapData.chunk_size; x++)
  //     {
  //       let nav = NavMesh.chunks[0].map[y][x];
  //       if(nav == NavType.WALKABLE)
  //       {
  //         nodes[y][x] = 1;
  //         nodes[y][x+1] = 1;
  //         nodes[y+1][x] = 1;
  //         nodes[y+1][x+1] = 1;
  //       }
  //     }
  //   }

  //   console.log(nodes);

  //   const NODE_COUNT = nodes.length;
  //   let other = [];
  //   for(let y=0; y<NODE_COUNT; y++)
  //   {
  //     let row = [];
  //     for(let x=0; x<NODE_COUNT; x++)
  //     {
  //       if(nodes[y][x] == 1)
  //       {
  //         //find inner node i.e. surrounded by all walkable nodes
  //         if(
  //           (y-1 < 0 || nodes[y-1][x] == 1) && //up
  //           (y+1 == NODE_COUNT || nodes[y+1][x] == 1) && //down
  //           (x-1 < 0 || nodes[y][x-1] == 1) && //left
  //           (x+1 == NODE_COUNT || nodes[y][x+1] == 1) && //right
  //           (y-1 < 0 || x-1 < 0 || nodes[y-1][x-1] == 1) && //top left
  //           (y-1 < 0 || x+1 == NODE_COUNT || nodes[y-1][x+1] == 1) && //top right
  //           (y+1 == NODE_COUNT || x-1 < 0 || nodes[y+1][x-1] == 1) && //bototm left
  //           (y+1 == NODE_COUNT || x+1 == NODE_COUNT || nodes[y+1][x+1] == 1) // bottom right
  //         )
  //         {
  //           row.push(0);
  //         }
  //         else
  //         {
  //           row.push(1);
  //         }
  //       }
  //       else
  //       {
  //         row.push(0);
  //       }
  //     }
  //     other.push(row);
  //   }

  //   console.log(other);
  //   NavMesh.nodes = other;
  // }
}

NavMesh.chunks = [];
NavMesh.nodes = [];