
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

  async execute(params, items, request, pageParam) {
    let responses = [];
    console.log("EXECUTE");
    console.log(pageParam)
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
          body: JSON.stringify({body: items['main'][i], param: pageParam}),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
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
        console.log(e.message)
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
