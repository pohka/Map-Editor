//const {dialog} = require('electron').remote;

class File
{
  static save()
  {
    if(States.isProjectLoaded)
    {
      if(States.projectFileName.length == 0)
      {
        File.saveAs();
      }
      else
      {
        File.write(States.projectPath + States.projectFileName);
      }
    }
  }

  static saveAs()
  {
    if(States.isProjectLoaded)
    {
      const options = {
        defaultPath: "./",
        filters : [{ name: 'json', extensions: ['json']}]
      }

      dialog.showSaveDialog(null, options, (path) => {
        if(path !== undefined && path.length > 0)
        {
          let extention = ".json";
          if(path.endsWith(extention) == false)
          {
            path += extention;
          }


          let els = path.replace(/\\/g, "/").split("/");
          States.projectFileName = els.pop();
          States.projectPath = els.join("/") + "/";
          Project.updateProjectName();
          File.write(States.projectPath + States.projectFileName);
        }
      });
    }
  }

  static write(fullPath)
  {
    var fs = require('fs');
    try
    {
      let content = JSON.stringify(MapData);
      fs.writeFileSync(fullPath, content, 'utf-8');
      Notification.add("Saved '" + States.projectFileName + "'");
    }
    catch(err)
    {
      Notification.add("Failed to save", true);
      console.log("FILE FAILED TO SAVE", err);
    }
  }

  static load()
  {
    let options = { 
      properties: ['openFile'] ,
      filters : [{ name: 'json', extensions: ['json']}]
    };

    dialog.showOpenDialog(
      options,
      (result) => {

      if(
        result !== undefined && result.length > 0 &&
        result[0]!==undefined && result[0].length > 0
        )
      {
        let path = result[0];
        var fs = require('fs');
        fs.readFile(path, (err, data) => {
          if (!err) {
            let dataStr = data.toString();
            try
            {
              let obj = JSON.parse(dataStr);
              if(obj.version != VERSION)
              {
                Notification.add("Warning different version", true);
              }
              States.isProjectLoaded = false;
              MapData = obj;
              Project.set(path, true);
            }
            catch(err)
            {
              Notification.add("Failed to load file");
              console.log("FAILED TO LOAD FILE ", path, err);
            }
            
          }
          else
          {
            console.log("FAILED TO LOAD FILE", path, err);
          }
        });
      }
    });
  }
}