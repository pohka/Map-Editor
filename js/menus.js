
/** window menus */
class Menus
{
  /** inital load of the menus */
  static load()
  {
    for(let a=0; a<States.menus.length; a++)
    {
      States.menus[a].active = States.menus[a].options[0].name;
      let menuID = States.menus[a].id;
      let menuDOM = document.getElementById(menuID);
      
      for(let b=0; b<States.menus[a].options.length; b++)
      {
        let option = States.menus[a].options[b];
        let active = "";
        let windowEl = document.getElementById(States.menus[a].options[b].id);

        let isActive = (b == 0);
        active  = " active='" + isActive + "' ";
        windowEl.setAttribute("active", isActive);

        //set state in viewport
        if(option.viewport !== undefined)
        {
          viewports[option.viewport].setIsActive(isActive);
        }

        menuDOM.innerHTML += "<div class=\"menu-item\" name=\"" + option.name + "\"" +
          active + 
          "onclick=\"Menus.itemClicked('"+option.name+"','"+menuID+"')\">" + 
          option.text +
          "</div>";
      }
    }
  }

  /** sets the current active menu item and updates the DOM
   * @param {string} menuID - name of the menu
   * @param {string} nextActiveName - next active menu item
   */
  static update(menuID, nextActiveName)
  {
    let hasFoundMenuID = false;
    for(let i=0; i<States.menus.length && !hasFoundMenuID; i++)
    {
      if(menuID == States.menus[i].id)
      {
        hasFoundMenuID = true;

        //don't update if its the same menu option
        if(States.menus[i].active != nextActiveName)
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

            let curOption = Menus.getOption(menuID, States.menus[i].active);
            if(curOption != null)
            {
              let windowEl = document.getElementById(curOption.id);
              windowEl.setAttribute("active", false);

              //update state in viewport
              if(curOption.viewport !== undefined)
              {
                let key = curOption.viewport;
                viewports[key].setIsActive(false);
              }
            }
            States.menus[i].active = nextActiveName;

            //set attribute for menu items, only 1 per menu can be active
            //behaves similarly to radio buttons
            let isFound = false;
            for(let a=0; a<menuItems.length; a++)
            {
              let isMatchingName = (menuItems[a].getAttribute("name") == States.menus[i].active);
              let isActive = !isFound && isMatchingName;
              
              if(isActive)
              {
                isFound = true;
              }

              menuItems[a].setAttribute("active", isActive);
            }

            //update windows
            for(let a=0; a<States.menus[i].options.length; a++)
            {
              let isActive = (States.menus[i].options[a].name == States.menus[i].active);

              let windowEl = document.getElementById(States.menus[i].options[a].id);
              if(windowEl != null)
              {
                windowEl.setAttribute("active",  isActive);
              }

              //update state in viewport
              if(States.menus[i].options[a].viewport !== undefined)
              {
                let key = States.menus[i].options[a].viewport;
                viewports[key].setIsActive(isActive);
                if(isActive)
                {
                  viewports[key].draw();
                }
              }
            }
          }
        }
      }
    }
  }

  static getOption(menuID, optionName)
  {
    for(let a=0; a<States.menus.length; a++)
    {
      if(States.menus[a].id == menuID)
      {
        for(let b=0; b<States.menus[a].options.length; b++)
        {
          if(States.menus[a].options[b].name == optionName)
          {
            return States.menus[a].options[b];
          }
        }
      }
    }

    return null;
  }

  /** menu item on click event
  * @param {string} itemName - name of a the menu item
  * @param {string} menuID - id of the menu the item belongs to
  */
  static itemClicked(itemName, menuID)
  {
    Menus.update(menuID, itemName);
  }

  /** sets the active options to the first option in all menus */
  static resetAll()
  {
    for(let i=0; i<States.menus.length; i++)
    {
      if(States.menus[i].starting != States.menus[i].active)
      {
        Menus.update(States.menus[i].id, States.menus[i].options[0].name);
      }
    }
  }
}