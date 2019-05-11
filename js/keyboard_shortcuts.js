//keyboard shortcuts
document.onkeydown = function(e)
{
  

  // ctrl+z
  if (e.ctrlKey)
  {
    if(!e.shiftKey)
    {
      // ctrl+z
      if(e.keyCode == 90)
      {
        Action.undo();
      }
    }
    //ctrl+shift
    else
    {
      // ctrl+shift+z
      if(e.keyCode == 90)
      {
        Action.redo();
      }
    }
  }

  //dont do any 1 key commands if currently typing input
  if(document.activeElement.tagName == "INPUT")
  {
    return;
  }

  // B
  if(e.keyCode == 66)
  {
    Tools.selectTool("brush");
  }
  // E
  else if(e.keyCode == 69)
  {
    Tools.selectTool("eraser");
  }
}