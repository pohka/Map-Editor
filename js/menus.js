
/** window menus */
class Menus
{
  /** inital load of the menus */
  static load()
  {
    for(let i=0; i<States.menus.length; i++)
    {
      Menus.update(States.menus[i].id, States.menus[i].active, true);
      let menuDOM = document.getElementById(States.menus[i].id);
      if(menuDOM === undefined || menuDOM == null)
      {
        console.log("menu DOM element not found for menuID:", States.menus[i].id);
      }
      let menuItems = menuDOM.getElementsByClassName("menu-item")
      if(menuItems.length == 0)
      {
        console.log("no menu items found for menuID:", States.menus[i].id);
      }

      let menuID = States.menus[i].id;
      for(let a=0; a<menuItems.length; a++)
      {
        let itemName = menuItems[a].getAttribute("name");
        menuItems[a].setAttribute("onclick", "Menus.itemClicked('"+itemName+"','"+menuID+"')");
      }
    }
  }

  /** sets the current active menu item and updates the DOM
   * @param {string} menuID - name of the menu
   * @param {string} activeName - next active menu item
   * @param {boolean} [isFirstTime] - set to true if first time setting menu
   */
  static update(menuID, activeName, isFirstTime)
  {
    if(isFirstTime === undefined)
    {
      isFirstTime = false;
    }
    let hasFoundMenuID = false;
    for(let i=0; i<States.menus.length && !hasFoundMenuID; i++)
    {
      if(menuID == States.menus[i].id)
      {
        hasFoundMenuID = true;

        //don't update if its the same menu option, exeption case for first time loaded
        if(isFirstTime || States.menus[i].active != activeName)
        {
          let menuDOM = document.getElementById(States.menus[i].id);
          if(menuDOM === undefined || menuDOM == null)
          {
            console.log("menu DOM element not found for menuID:", States.menus[i].id);
          }
          else
          {
            let menuItems = menuDOM.getElementsByClassName("menu-item")
            if(menuItems.length == 0)
            {
              console.log("no menu items found for menuID:", States.menus[i].id);
            }

            States.menus[i].active = activeName;

            //set attribute for menu items, only 1 per menu can be active
            //behaves similarly to radio buttons
            let isFound = false;
            for(let a=0; a<menuItems.length; a++)
            {
              if(isFound)
              {
                menuItems[a].setAttribute("active", false);
              }
              else
              {
                let hasMatchingName = (menuItems[a].getAttribute("name") == States.menus[i].active);
                menuItems[a].setAttribute("active", !isFound && hasMatchingName);
                if(!isFound && hasMatchingName)
                {
                  isFound = true;
                }
              }
            }
          }

          
        }
      }
    }
  }

  /** menu item on click event
  * @param {string} itemName - name of a the menu item
  * @param {string} menuID - id of the menu the item belongs to
  */
  static itemClicked(itemName, menuID)
  {
    Menus.update(menuID, itemName, false);
  }
}