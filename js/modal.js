
class Modal
{
  constructor(id)
  {
    this.id = id;
  }

  toggle(nextIsVisible)
  {
    let modal = document.getElementById(this.id);
  
    if(nextIsVisible !== undefined){
      if(nextIsVisible)
      {
        modal.style.display = "block";
      }
      else
      {
        modal.style.display = "none";
      }
    }
    else if (modal.style.display == ""  || modal.style.display === "none" ) 
    {
          modal.style.display = "block";
    }
    else
    {
        modal.style.display = "none";
    }
  }

  static setPath(el)
  {
    let options = {
      properties: ['openDirectory']
    };
  
    dialog.showOpenDialog(
      options, (result) => {
        if(
          result !== undefined && result.length > 0 && 
          result[0] !== undefined && result[0].length > 0
          )
        {
          let path = result[0].replace(/\\/g,"/");
          el.value = path;
        }
    });
  }
}