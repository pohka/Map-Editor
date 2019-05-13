/** loading and creation of a project */
class Project
{
  /** Creates a new project */
  static createNew()
  {
    let projectPath = document.querySelector("#new-project-set-path").value;
    let tileSize = document.querySelector("#new-project-tile").value;
    let chunkSize = document.querySelector("#new-project-chunk").value;

    //validate input
    if(
      projectPath === undefined || projectPath.length <= 0 || 
      tileSize === undefined || tileSize <= 0 || 
      chunkSize === undefined || chunkSize <= 0
      )
    {
      Notification.add("Input not valid", true);
    }
    else
    {
      //reset map data
      MapData.chunks = [];
      MapData.tiles = [];
      MapData.tilesets = [];
      MapData.textures = [];
      MapData.draw_layers = [];
      MapData.texture_count = 0;
      MapData.tile_count = 0;
      MapData.chunk_size = parseInt(chunkSize);
      MapData.tile_size = parseInt(tileSize);
      MapData.chunk_total_size = MapData.chunk_size * MapData.tile_size;
      MapData.version = VERSION;
      MapData.draw_layers.push("base");
      Project.addEmptyChunk(0, 0);

      Layers.init();
      newProjectModal.toggle(false); //hide modal
      Project.set(projectPath, false);
    }
  }

  /** updates project name in DOM */
  static updateProjectName()
  {
    let projectNameEl = document.getElementById("project-name-text");
    projectNameEl.textContent = States.projectFileName;
  }

  /** loads a new/existing project, also resets States
   * @param {string} path - full path to a file or directory
   * @param {boolean} [isFile] - set to true if the path is a file and not a directory, default=false
   */
  //path is project path, isFile = false if path is a directory
  static set(path, isFile)
  {
    //reset States
    //menus
    for(let i=0; i<States.menus.length; i++)
    {
      if(States.menus[i].starting != States.menus[i].active)
      {
        Menus.update(States.menus[i].id, States.menus[i].starting, false);
      }
    }

    let projectNameEl = document.getElementById("project-name-text");

    //if path is a file
    if(isFile !== undefined && isFile)
    {
      //project path and fileName
      let els = path.replace(/\\/g, "/").split("/");
      States.projectFileName = els.pop();
      States.projectPath = els.join("/") + "/";
      projectNameEl.textContent = States.projectFileName;
    }
    //if path is a directory i.e. a new project
    else
    {
      States.projectFileName = "";
      States.projectPath = path + "/";
      projectNameEl.textContent = "unsaved project";
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

    //add new mapdata from new files found
    //load images
    Project.loadImages(function(newTextureIDs){
      Explorer.setRoot();

      //generate textures for new image files
      for(let i=0; i<newTextureIDs.length; i++)
      {
        let img = States.findImgObj(newTextureIDs[i]);
        if(img != null)
        {
          let path = Project.fullPathToResPath(img.getAttribute("src"));
          if(path.startsWith("tilesets/"))
          {
            Project.generateTiles(newTextureIDs[i]);
          }
        }
      }

      if(MapData.tilesets.length > 0)
      {
        States.current.tileset = MapData.tilesets[0];
      }
      else
      {
        States.current.tileset = -1;
      }

      mapViewport.draw();
      tileSelector.draw();
      Layers.updateList();
      States.isProjectLoaded = true;
      
      if(States.projectFileName.length == 0)
      {
        Notification.add("Created New Project");
      }
      else
      {
        Notification.add("Project loaded: " + States.projectFileName);
      }
    });
  }

  /** creates an empty chunk in MapData at chunk coordinate x, y
   * @param {number} x - x position in chunk coordinates
   * @param {number} y - y position in chunk coordinates
   */
  static addEmptyChunk(x, y)
  {
    let chunk = {
      x : x,
      y : y,
      textures_used : [ 0 ], //texture ids used in this chunk
      layers : []
    }
  
    for(let a=0; a<MapData.draw_layers.length; a++)
    {
      let layer = {
        name : MapData.draw_layers[a],
        map : []
      }
  
      for(let y = 0; y<MapData.chunk_size; y++)
      {
        let row = [];
        for(let x = 0; x<MapData.chunk_size; x++)
        {
          row.push(-1);
        }
        layer.map.push(row);
      }
      chunk.layers.push(layer);
    }
  
    MapData.chunks.push(chunk);
  }


  /** Generates tiles from a texture ID
   * @param {number} textureID 
   */
  static generateTiles(textureID)
  {
    let img = States.findImgObj(textureID);
    const tileW = Math.floor(img.width/MapData.tile_size);
    const tileH = Math.floor(img.height/MapData.tile_size);
    if(img != null)
    {
      for(let y=0; y<tileH; y++)
      {
        for(let x=0; x<tileW; x++)
        {
          MapQuery.addTile(textureID, x, y);
        }
      }
    }
    else 
    {
      console.log("failed to generate tiles for texID", textureID);
    }
  }

  /** converts a fullPath to a file relative to the resources folder, returns undefined if invalid path
    *  @param {string} fullPath
    * @return {string|undefined}
    */
  static fullPathToResPath(fullPath)
  {
    let els = fullPath.replace(/\\/g, "/").split("/"+Explorer.resFolder);
    if(els.length == 2)
    {
      return els[1];
    }
  }

  /** finds all the files in a directory
   * @param {string} dir - directory
   * @param {function} done - callback function on completed
   * @param {array} params - result
   */
  static walk(dir, done, params) 
  {
    var fs = require('fs');
    var path = require('path');
    var results = [];
    fs.readdir(dir, function(err, list) 
    {
      if(err)
      {
        return done(err);
      }
      var pending = list.length;
      if (!pending) return done(null, results, params);
      list.forEach(function(file)
      {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat)
        {
          if (stat && stat.isDirectory())
          {
            Project.walk(file, 
              function(err, res)
              {
                results = results.concat(res);
                if (!--pending) done(null, results, params);
              }
            );
          } 
          else
          {
            results.push(file);
            if (!--pending) done(null, results, params);
          }
        });
      });
    });
  }

  /** loads all the images in the directory from States.projectPath 
   * @param {function} onCompleteCallback - callback on completed load
   */
  static loadImages(onCompleteCallback)
  {
    Project.walk(States.projectPath, function(err, files){
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
          let src = Project.fullPathToResPath(files[i]);
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
    });
  }
}