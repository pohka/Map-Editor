/** Notifications */
class Notification
{
  /** create a new notification
   * @param {string} text - text content
   * @param {boolean} [isErr]  - set to true to display error themed notification
   */
  static add(text, isErr)
  {
    let id = Notification.count;
    if(isErr === undefined)
    {
      isErr = false;
    }
    Notification.list[id] = {
      text : text,
      isErr : isErr
    };

    if(Object.keys(Notification.list).length > Notification.maxNotifications)
    {
      delete Notification.list[Object.keys(Notification.list)[0]];
    }

    Notification.updateNotificationDOM();

    //remove after duration
    let duration = 8000;
    setTimeout(function(){
      delete Notification.list[id];
      Notification.updateNotificationDOM();
    }, duration);

    Notification.count++;
  }

  /** Updates notification DOM */
  static updateNotificationDOM()
  {
    let parent = document.getElementsByClassName("notification-con")[0];
    while (parent.firstChild)
    {
      parent.removeChild(parent.firstChild);
    }

    for(let i in Notification.list)
    {
      let item = document.createElement("div");
      item.className = "notification";
      if(Notification.list[i].isErr)
      {
        item.className += " notification-err";
      }
      item.innerText = Notification.list[i].text;
      parent.append(item);
    }
  }
}

/** maximum number of notifications */
Notification.maxNotifications = 5;

/** current notification count */
Notification.count = 0;

/** current active notifications */
Notification.list = {};
