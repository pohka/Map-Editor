//const {dialog} = require('electron').remote;

class File
{
  static save()
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

        var fs = require('fs');
        try
        {
          let content = JSON.stringify(MapData);
          fs.writeFileSync(path, content, 'utf-8'); 
          Notification.add("Saved!");
        }
        catch(e)
        {
          Notification.add("Failed to save", true);
          console.log("FILE FAILED TO SAVE", e);
        }
      }
    });
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
              States.setFromLoad(path, true);
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