
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  
  export class WaitNode {
    constructor() {
      this.description = {
        displayName: "Wait for a specific amount of time",
        name: "ui_wait",
        category: ["ui", "util"],
        description: "This nodes changes any UI component",
        inputs: ["main"],
        img: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/softbank/145/hourglass_231b.png",
        parameters: [{
          displayName: 'Time in milliseconds',
          name: 'time',
          type: 'number',
          required: true,
          value: ""
        }],
        outputs: ["main"],
        version: 1
      };
    }
    async execute(params, items, setJsxModel, jsxModel) {
      let time = params[0]['time'];
      await sleep(Number.parseInt(time));
      return items;
    }
  }
