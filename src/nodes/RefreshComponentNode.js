

export class RefreshComponentNode {
    constructor() {
      this.description = {
        displayName: "Refresh a component",
        name: "ui_refresh",
        category: ["ui", "util"],
        description: "This nodes changes any UI component",
        inputs: ["main"],
        img: "http://simpleicon.com/wp-content/uploads/refresh.png",
        parameters: [{
          displayName: 'Component id',
          name: 'id',
          type: 'component',
          required: true,
          value: ""
        }],
        outputs: ["main"],
        version: 1
      };
    }
  
    async execute(params, items, setJsxModel, jsxModel, production) {
      const effect = production ? "renderProps" : "previewRenderProps";
      let id = params[0]['id'];
      let workflowId = -1;
      let newJsxModel = { ...jsxModel };
      if (jsxModel.components[id][effect]['workflowId']) {
        workflowId = jsxModel.components[id][effect]['workflowId']
      } else if (jsxModel.components[id]['renderProps']['workflowId']) {
        workflowId = jsxModel.components[id]['renderProps']['workflowId']
      }
      const newData = await fetch(global.endpoint + "/execute/" + workflowId, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: "{}",
      });
      const newItems = await newData.json();
      newJsxModel.components[id][effect]['data'] = newItems
      await setJsxModel(newJsxModel);
      return { main: [{}] };
    }
    async executeProduction(params, items, setJsxModel, jsxModel) {
      return this.execute(params,items, setJsxModel,jsxModel, true)
    }
  }
