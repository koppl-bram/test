
import evaluate from 'simple-evaluate';

function parseVariable(data, renderProps) {
    if (!data) {
        return renderProps;
    }
    let newRenderProps = JSON.parse(JSON.stringify(renderProps));
    for (let renderProp in renderProps) {
        if (renderProps[renderProp]) {
            if (typeof renderProps[renderProp] === "string") {
                let variables = renderProps[renderProp].match(/{{s?.*?s?}}/g);
                for (let variable in variables) {
                    let result;
                    let param = variables[variable]
                        .replace("{{", "")
                        .replace("}}", "")
                        .trim();
                    try {
                        result = evaluate({ data, param }, `data.${ param }`);
                    } catch (e) {
                        console.log(e)
                        result = null;
                    }
                    if (result && typeof result === "string") {
                        newRenderProps[renderProp] = newRenderProps[renderProp].replace(variables[variable], result);
                    }
                }
            }
        }
    }
    return newRenderProps;
}

export { parseVariable }
