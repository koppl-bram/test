
export class GoToPageNode {
    constructor() {
      this.description = {
        displayName: "Go to page",
        name: "ui_page",
        category: ["ui", "util"],
        description: "This nodes brings the user to a different page",
        inputs: ["main"],
        img: "https://i.imgur.com/o9QYU9V.png",
        parameters: [{
          displayName: 'Page id',
          name: 'id',
          type: 'string',
          required: true,
          value: ""
        }],
        outputs: ["main"],
        version: 1
      };
    }
  
    execute(params, items, setJsxModel, setCurrentAppPage, appPages) {
      let id = params[0]['id'];
      for (let appPage in appPages) {
        if (appPages[appPage]['path'] === params[0]['id']) {
          setCurrentAppPage(appPage);
          setJsxModel(appPages[appPage]);
        }
      }
      return items;
    }
  
    executeProduction(params, items, history) {
      history.push(params[0]["id"])
      return items
    }
  }
