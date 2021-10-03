

export class ValidateNode {
    constructor() {
      this.description = {
        displayName: "Validate UI components",
        name: "ui_validate",
        category: ["ui", "util"],
        description: "This node checks UI components if they are valid",
        inputs: ["main"],
        img: "https://i.imgur.com/o9QYU9V.png",
        parameters: [{
          displayName: 'Ids',
          name: 'ids',
          type: 'array',
          value: [{}],
          parameters: [{
            displayName: 'Component id',
            name: 'id',
            type: 'component',
            required: true
          }]
        }],
        outputs: ["main", "error"],
        version: 1
      };
    }
  
    async execute(params, items, setJsxModel, jsxModel, toast, mode) {
      let effect = "previewRenderProps";
      if (mode === "production") {
        effect = "renderProps"
      }
      const response = {};
      let error = false;
      for (let i = 0; i < items['main'].length; i++) {
        await params[i].ids.map(async (param) => {
          if (jsxModel.components[param['id']]) {
            let item = jsxModel.components[param['id']];
            let finalRenderProps = { ...item[effect] };
            if(effect === "previewRenderProps"){
              finalRenderProps = {...item.renderProps, ...item.previewRenderProps}
            }
            let value = finalRenderProps["value"];
            let regex = finalRenderProps["regex"];
            if (value && regex) {
              try {
                if (!value.match(new RegExp(regex, "s"))) {
                  response['error'] = [{ id: param['id'] }]
                }
              } catch (ignore) { }
            }
            if (finalRenderProps["isRequired"] && !value) {
              console.log("Error ___")
              response['error'] = [{ id: param['id'] }]
            }
          }
          else {
            error = true;
            if (mode !== "production") {
              toast({
                title: "Koppl flow error",
                description: `Components: ${param["id"]} was not found!`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
              });
            }
          }
        });
      }
      if (!error) {
        if (response['error']) {
          return response;
        } else {
          return { main: [{}] }
        }
      }
    }
  
    executeProduction(params, items, setComponents, components, toast) {
      return this.execute(params, items, setComponents, components, toast, "production")
    }
  }
