
class Explorer
{
  static setRoot()
  {
    Explorer.currentDir = "";
    Explorer.set();
  }


  static nextDir(folderName)
  {
    Explorer.currentDir += folderName + "/";
    Explorer.set();
  }

  static prevDir()
  {
    if(Explorer.currentDir.length == 0)
    {
      return;
    }
    let path = Explorer.currentDir;
    if(path.endsWith("/"))
    {
      path.slice(0, -1);
    }
    let els = path.split("/");
    if(els.length > 1)
    {
      els.pop();
      els.pop();
      path = els.join("/");
      if(path.length > 0)
      {
        path += "/";
      }
      Explorer.currentDir = path;
      Explorer.set();
    }
    else
    {
      Explorer.currentDir = "";
      Explorer.set();
    }

  }

  //set folder once changed
  static set()
  {
    let rootDOM = document.getElementById("file-system");
    //clear dom
    while (rootDOM.firstChild) {
      rootDOM.removeChild(rootDOM.firstChild);
    }

    //let dir = "./projects/" + MapData.project_name + "/" + Explorer.resFolder + Explorer.currentDir;
    let dir = States.projectPath + Explorer.resFolder + Explorer.currentDir;
 
    Explorer.items = [];

    var list = [];
    var err;
    var fs = require('fs');
    var path = require('path');
    fs.readdir(dir, function(err, list)
    {
      for(let i=0; i<list.length; i++)
      {
        if(list[i].split(".").length == 1)
        {
          Explorer.items.push({
            type : Explorer.type.folder,
            name : list[i]
          });
        }
        else
        {
          if(Explorer.isImage(list[i]))
          {
            Explorer.items.push({
              type : Explorer.type.image,
              name : list[i]
            });
          }
          else {
            Explorer.items.push({
              type : Explorer.type.file,
              name : list[i]
            });
          }
        }
      }

      Explorer.sortItems();
      Explorer.updateDOM();
    });
  }

  //sort items
  static sortItems()
  {
    //bubble sort
    var length = Explorer.items.length;
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < (length - i - 1); j++) {
            //sort by type, if same type sort by name
            if((Explorer.items[j].type > Explorer.items[j+1].type) ||
              (
                Explorer.items[j].type == Explorer.items[j+1].type &&
                Explorer.items[j].name > Explorer.items[j+1].name
              )
            ) {
                //Swap the numbers
                var tmp = Explorer.items[j];  //Temporary variable to hold the current number
                Explorer.items[j] = Explorer.items[j+1]; //Replace current number with adjacent number
                Explorer.items[j+1] = tmp; //Replace adjacent number with current number
            }
        }
    }
  }

  static updateDOM()
  {
    //clear dom
    let rootDOM = document.getElementById("file-system");
    while (rootDOM.firstChild) {
      rootDOM.removeChild(rootDOM.firstChild);
    }

    //set directory text
    let dirTextDom = document.getElementById("file-system-dir-val");
    dirTextDom.textContent = "/" + Explorer.resFolder + Explorer.currentDir;

    //create DOM elements from data
    for(let i=0; i<Explorer.items.length; i++)
    {
      switch(Explorer.items[i].type)
      {
        case Explorer.type.folder:
          rootDOM.innerHTML +=
            '<div class="file" onclick=Explorer.nextDir("'+Explorer.items[i].name+'")>' +
              '<i class="fas fa-folder file-icon"></i>' +
              '<div class="file-name">' + Explorer.items[i].name +'</div>' +
            '</div>';
          break;
        case Explorer.type.image:
          //let src = "./projects/" + MapData.project_name + "/" + Explorer.resFolder + Explorer.currentDir + Explorer.items[i].name;
          let src = States.projectPath + Explorer.resFolder + Explorer.currentDir + Explorer.items[i].name;
          
          //extra for tilesets changing explorer
          let extra = "";
          if(Explorer.currentDir == "tilesets/")
          {
            let imgPath = Explorer.currentDir + Explorer.items[i].name;
            let tex = MapQuery.findTextureBySrc(imgPath);
            if(tex != null)
            {
              extra='onclick=States.setTileSet('+tex.id+')';
            }
            else {
              console.log("texture not found", imgPath);
            }
          }

          rootDOM.innerHTML +=
            '<div class="file" '+extra+'>' +
              '<img src="' + src + '"/>' +
              '<div class="file-name">' + Explorer.items[i].name +'</div>' +
            '</div>';
          break;
        case Explorer.type.file:
          rootDOM.innerHTML +=
            '<div class="file">' +
              '<i class="fas fa-file file-icon"></i>' +
              '<div class="file-name">' + Explorer.items[i].name +'</div>' +
            '</div>';
          break;
      }
    }
  }

  //returns true if string ends in .png, .jpg or .jpeg
  static isImage(path)
  {
    return path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg");
  }
}

Explorer.type =
{
  folder : 0,
  image : 1,
  file : 2
};
// Explorer.type.folder = 0;
// Explorer.type.image = 1;
// Explorer.type.file = 2;


Explorer.resFolder = "res/";
Explorer.currentDir = "";
Explorer.items = [
  // {
  //   type : "folder",
  //   name : "tilesets"
  // }
];
