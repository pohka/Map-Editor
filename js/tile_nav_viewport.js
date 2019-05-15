class TileNavViewport extends Viewport
{
  
  constructor(id)
  {
    super(id);
    this.addInput();
  }

  addInput()
  {
    let vp = this;
  }

  draw()
  {
    if(this.isActive)
    {
      super.clear();
      
    }
  }
}