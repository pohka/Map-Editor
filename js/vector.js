
/**
  * @typedef {Object} Vector
  * @property {number} x - x
  * @property {number} y - y
  */
class Vector
{
  /**
   * @param {number} x 
   * @param {number} y 
   */
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
  }

  /**
   * Append current vector position
   * @param {number} x 
   * @param {number} y 
   */
  moveBy(x,y)
  {
    this.x += x;
    this.y += y;
  }

  /**
   * set vector position
   * @param {number} x 
   * @param {number} y 
   */
  set(x,y)
  {
    this.x = x;
    this.y = y;
  }
}
