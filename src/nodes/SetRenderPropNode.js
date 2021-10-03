
export class SetRenderPropNode {
  constructor() {
    this.description = {
      displayName: "Change component",
      name: "ui_change",
      category: ["ui", "util"],
      description: "This nodes sets UI components' properties",
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
          displayName: 'Property value',
          name: 'value',
          type: 'string',
          required: false
        }]
      }],
      outputs: ["main"],
      version: 1
    };
  }

  execute(params, items, setJsxModel, mode) {
    let effect = "previewRenderProps"
    if (mode === "production") {
      effect = "renderProps"
    }
    for (let i = 0; i < items['main'].length; i++) {
      params[i].components.map((param) => {
        setJsxModel((old) => {
          let newObj = { ...old }
          try {
            if(param['property'] === "hidden" &&  newObj.components[param['id']]['renderProps']['usesfade']){
              param['property'] = "in"
              param['value'] = !param['value']
            }
            newObj.components[param['id']][effect][param['property']] = param['value'];
          }
          catch (e) {
            console.log(e.message);
            console.log(param['id']);
            console.log(param)
            console.log(newObj.components[param['id']]);
          } finally {
            return newObj
          }
        });
      });
    }
    return { main: [{}] };
  }

  executeProduction(params, items, setComponents) {
    return this.execute(params, items, setComponents, "production")
  }
}
