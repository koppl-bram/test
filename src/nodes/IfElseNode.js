

export class IfElseNode {
    constructor() {
      this.description = {
        displayName: "If condition",
        name: "ui_if",
        category: ["action", "util"],
        description: "If/Else based logic",
        inputs: ["main"],
        img: "https://i.imgur.com/8NNoXKe.png",
        outputs: ["true", "false"],
        parameters: [
          {
            displayName: "Variable",
            name: "var",
            type: "string",
            required: true,
            description: "",
          },
          {
            displayName: "Operator",
            name: "operator",
            type: "string",
            options: ["Exists","Equals", "Not Equals", "Greater than", "Smaller than"],
            required: true,
            value: "Exists",
            description: "Determine the operator",
          },
          {
            displayName: "Value",
            name: "value",
            type: "string",
            required: true,
            description: "",
          },
        ],
        version: 1,
      };
    }
    async execute(params, items, setJsxModel, jsxModel) {
      let trueItems = [];
      let falseItems = [];
      //@ts-ignore
      for (const item in items["main"]) {
        let variable = params[item]["var"];
        let value = params[item]["value"];
        let operator = params[item]["operator"];
        if (operator === "Exists") {
          if (variable) {
            trueItems.push(items["main"][item]);
          } else {
            falseItems.push(items["main"][item]);
          }
        }
        if (operator === "Equals") {
          if (variable === value) {
            trueItems.push(items["main"][item]);
          } else {
            falseItems.push(items["main"][item]);
          }
        }
        if (operator === "Not Equals") {
          if (variable != value) {
            trueItems.push(items["main"][item]);
          } else {
            falseItems.push(items["main"][item]);
          }
        }
  
        if (operator === "Greater than") {
          if (variable > value) {
            trueItems.push(items["main"][item]);
          } else {
            falseItems.push(items["main"][item]);
          }
        }
  
        if (operator === "Smaller than") {
          if (variable < value) {
            trueItems.push(items["main"][item]);
          } else {
            falseItems.push(items["main"][item]);
          }
        }
      }
      if (trueItems.length === 0) {
        trueItems = undefined;
      }
      if (falseItems.length === 0) {
        falseItems = undefined;
      }
      return { true: trueItems, false: falseItems };
    }
  }
