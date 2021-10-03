
export class ExecuteWorkflowNode {
    constructor() {
      this.description = {
        displayName: "Execute an automation workflow",
        name: "ui_execute_workflow",
        category: ["ui", "util"],
        description: "This nodes changes any UI component",
        inputs: ["main"],
        img: "https://i.imgur.com/JJ46eFt.png",
        parameters: [{
          displayName: 'Workflow id',
          name: 'id',
          type: 'workflow',
          required: true,
          value: ""
        }],
        outputs: ["main"],
        version: 1
      };
    }
  
    async execute(params, items, request) {
      let responses = []
      for (let i = 0; i < items['main'].length; i++) {
        try {
          let workflowId = params[i]['id'];
          await fetch(global.endpoint + "/execute/" + workflowId, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(items['main'][i]),
          })
            .then((response) => response.json())
            .then((data) => {
              if (Array.isArray(data)) {
                responses = responses.concat(data)
              } else {
                responses.push(data)
              }
            })
            .catch((error) => {
              throw new Error(error)
            });
        }
        catch (e) {
          throw new Error(e)
        }
      }
      if (responses.length > 0) {
        return { main: responses };
      }
      else {
        return { main: [] }
      }
    }
  }
