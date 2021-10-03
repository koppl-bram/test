
export class ToastNode {
    constructor() {
      this.description = {
        displayName: "Pop up notification",
        name: "ui_toast",
        category: ["ui", "util"],
        description: "This shows a pop up notification.",
        inputs: ["main"],
        img: "https://i.imgur.com/CFFU6r9.png",
        parameters: [{
          displayName: 'title',
          name: 'title',
          type: 'string',
          required: true,
          value: ""
        }, {
          displayName: 'description',
          name: 'description',
          type: 'string',
          required: true,
          value: ""
        }, {
          displayName: 'status',
          name: 'status',
          type: 'string',
          required: true,
          options: ["success", "info", "warning", "error"],
          value: "success"
        },
        {
          displayName: 'duration in ms',
          name: 'duration',
          type: 'number',
          required: true,
          value: 5000
        }, {
          displayName: 'position',
          name: 'position',
          type: 'string',
          required: true,
          options: [
            "top",
            "top-right",
            "top-left",
            "bottom",
            "bottom-right",
            "bottom-left",
          ],
          value: "bottom"
        }],
        outputs: ["main"],
        version: 1
      };
    }
    async execute(params, items, toast) {
      toast({
        title: params[0]['title'],
        description: params[0]['description'],
        status: params[0]['status'],
        duration: params[0]['duration'],
        isClosable: true,
        position: params[0]['position'],
      });
      return items;
    }
  
    async executeProduction(params, items, toast) {
      return this.execute(params,items,toast)
    }
  }
