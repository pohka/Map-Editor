class Vector
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
  }
  moveBy(x,y)
  {
    this.x += x;
    this.y += y;
  }

  set(x,y)
  {
    this.x = x;
    this.y = y;
  }
}
