//keyboard shortcuts
document.onkeydown = function(e)
{
  //ctrl+z
  if (e.ctrlKey)
  {
    if(!e.shiftKey)
    {
      //ctrl+z
      if(e.keyCode == 90)
      {
        Action.undo();
      }
    }
    //ctrl+shift
    else
    {
      //ctrl+shift+z
      if(e.keyCode == 90)
      {
        Action.redo();
      }
    }
  }
}