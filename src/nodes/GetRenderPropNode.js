
export class GetRenderPropNode {
    constructor(options) {
      this.description = {
        displayName: "Get property of UI components",
        name: "ui_get",
        category: ["ui", "util"],
        description: "This node gets properties of UI component such as 'value' or 'color'",
        inputs: ["main"],
        img: "https://i.imgur.com/o9QYU9V.png",
        parameters: [{
          displayName: 'Components',
          name: 'components',
          type: 'array',
          value: [{}],
          parameters: [{
            displayName: 'Component id',
            name: 'id',
            type: 'component',
            required: true
          }, {
            displayName: 'Property name',
            name: 'property',
            type: 'string',
            options: ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"],
            required: true
          }, {
            displayName: 'json key',
            name: 'key',
            type: 'string',
            required: false
          }]
        }],
        outputs: ["main"],
        version: 1
      };
    }
  
    execute(params, items, setJsxModel, isProduction) {
      let effect = isProduction ? "renderProps" : "previewRenderProps";
      const response = [];
      for (let i = 0; i < items['main'].length; i++) {
        let newObj = {};
        params[i].components.map((param) => {
          setJsxModel((old) => {
            try {
              if (old.components[param['id']][effect][param['property']] !== undefined) {
                newObj[param['key']] = old.components[param['id']][effect][param['property']];
              } else if (old.components[param['id']]['renderProps'][param['property']] !== undefined) {
                newObj[param['key']] = old.components[param['id']]['renderProps'][param['property']];
              }
              if (old.components[param['id']]['type'] === "numberInput") {
                newObj[param['key']] = Number(newObj[param['key']]);
              }
              if (old.components[param['id']]['type'] === "autocomplete") {
                newObj[param['key']] = newObj[param['key']].map((e) => { return e.value })
              }
            }
            catch (e) {
              console.log(e.message);
            } finally {
              return old
            }
          });
        });
        response.push(newObj)
      }
      return { main: response };
    }
  
    executeProduction(params, items, setJsxModel) {
      console.log("getting")
      return this.execute(params, items, setJsxModel, true)
    }
  }
