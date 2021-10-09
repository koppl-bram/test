

import { ToastNode } from "./nodes/ToastNode";
import { SetRenderPropNode } from "./nodes/SetRenderPropNode";
import { GoToPageNode } from "./nodes/GoToPageNode"
import { ValidateNode } from "./nodes/ValidateNode"
import { GetRenderPropNode } from "./nodes/GetRenderPropNode"
import { ExecuteWorkflowNode } from "./nodes/ExecuteWorkflowNode"
import { RefreshComponentNode } from "./nodes/RefreshComponentNode";
import { IfElseNode } from "./nodes/IfElseNode";
const toposort = require('toposort')

async function execute(initialItems, data, setComponents, toast, history, components, param) {
    let edges = data.filter((point) => { return point.target });
    let executionOrder = []
    if (edges.length === 0) {
        executionOrder = [data[0].id];
    } else {
        executionOrder = toposort(
            edges.map((edge) => {
                return [edge.source, edge.target];
            })
        );
    }
    const sortedNodes = [];
    for (let name of executionOrder) {
        for (let node of data) {
            if (node.id === name) {
                sortedNodes.push(node);
            }
        }
    }
    let obj = {}
    let items = { "main": [initialItems] }
    for (let i = 0; i < sortedNodes.length; i++) {
        for (let j = 0; j < edges.length; j++) {
            if (edges[j].target === sortedNodes[i]['id']) {
                if (items[edges[j]['targetHandle']]) {
                    items[edges[j]['targetHandle']] = items[edges[j]['targetHandle']].concat(obj[edges[j].source][edges[j].sourceHandle]);
                }
                else {
                    if (obj[edges[j].source]) {
                        items[edges[j]['targetHandle']] = obj[edges[j].source][edges[j].sourceHandle];
                    }
                    else {
                        items[edges[j]['targetHandle']] = undefined;
                    }
                }
            }
        }
        if (items["main"] !== undefined) {
            items = await executeNode(initialItems, sortedNodes[i].data, items, setComponents, toast, history, components, param);
            obj[sortedNodes[i]['id']] = items;
        }
        items = {}
    }
}


async function executeNode(initialItems, data, items, setComponents, toast, history, components, param) {
    let newParams = {}
    data.parameters.map((param) => {
        newParams[param['name']] = param['value']
        if (param['value'] === "false") {
            newParams[param['name']] = false
        }
    })
    if (data.name === "ui_change") {
        return new SetRenderPropNode().executeProduction(parseParameters(newParams, items, initialItems, param), items, setComponents)
    }
    if (data.name === "ui_get") {
        return new GetRenderPropNode().executeProduction(parseParameters(newParams, items, initialItems, param), items, setComponents)
    }
    if (data.name === "ui_page") {
        return new GoToPageNode().executeProduction(parseParameters(newParams, items, initialItems, param), items, history)
    }
    if (data.name === "ui_execute_workflow") {
        let executionflow = new ExecuteWorkflowNode()
        let tmp = await executionflow.execute(parseParameters(newParams, items, initialItems, param), items, initialItems, param)
        return tmp;
    }
    if (data.name === "ui_refresh") {
        return new RefreshComponentNode().executeProduction(parseParameters(newParams, items, initialItems), items, setComponents, components)
    }
    if (data.name === "ui_validate") {
        return new ValidateNode().executeProduction(parseParameters(newParams, items, initialItems), items, setComponents, components, toast)
    }
    if (data.name === "ui_toast") {
        return new ToastNode().executeProduction(parseParameters(newParams, items, initialItems), items, toast)
    }
    if (data.name === "ui_if") {
        return new IfElseNode().execute(parseParameters(newParams, items, initialItems), items, setComponents, components, toast)
    }
}

function listEvaluate(currentItem, initialItems, variables, variable, propertyCopy, param) {
    try {
        let newVar = undefined;
        if (variables[variable]
            .replaceAll(" ", "")
            .replace("{{", "")
            .replace("}}", "") === "param") {
            newVar = param;
        }
        else {
            newVar = eval(
                "const item = " +
                JSON.stringify(currentItem) +
                ";" +
                "const request = " +
                JSON.stringify(initialItems) +
                ";" +
                "item." + variables[variable]
                    .replace(" ", "")
                    .replace("{{", "")
                    .replace("}}", "")
            );
        }
        if (newVar === undefined) {
            return propertyCopy.replace(variables[variable], "");
        }
        if (typeof newVar === "string" && typeof propertyCopy === "string") {
            return propertyCopy.replace(variables[variable], newVar);
        } else if (typeof newVar === "number" && typeof propertyCopy === "string") {
            return propertyCopy.replace(variables[variable], newVar);
        } else if (typeof propertyCopy === "number") {
            return newVar;
        } else {
            // 0 is not a number 
            if (variable === "0") {
                return newVar;
            }
            // treated as an object
            else {
                return { ...propertyCopy, ...newVar };
            }
        }
    } catch (e) {
        return ""
    }
}

function evaluate(currentItem, initialItems, variables, variable, propertyCopy, param) {
    console.log(propertyCopy)
    try {
        let newVar = undefined;
        if (variables[variable]
            .replaceAll(" ", "")
            .replace("{{", "")
            .replace("}}", "") === "param") {
            newVar = param;
        }
        else {
            newVar = eval(
                "const item = " +
                JSON.stringify(currentItem) +
                ";" +
                "const request = " +
                JSON.stringify(initialItems) +
                ";" +
                variables[variable]
                    .replace(" ", "")
                    .replace("{{", "")
                    .replace("}}", "")
            );
        }
        if (typeof newVar === "string" && typeof propertyCopy === "string") {
            return propertyCopy.replace(variables[variable], newVar);

        } else if (typeof newVar === "number" && typeof propertyCopy === "string") {
            return propertyCopy.replace(variables[variable], newVar);
        } else if (typeof propertyCopy === "number") {
            return newVar;
        } else {
            // 0 is not a number 
            if (variable === "0") {
                return newVar;
            }
            // treated as an object
            else {
                return { ...propertyCopy, ...newVar };
            }
        }
    } catch (e) {
        return ""
    }
}

function parseListData(parameters, items, param) {
    const newParameters = {};
    for (const property in parameters) {
        if (typeof parameters[property] === "string") {
            let propertyCopy = parameters[property].slice();
            if (propertyCopy !== undefined) {
                let variables = propertyCopy.match(/{{s?.*?s?}}/g);
                for (let variable in variables) {
                    propertyCopy = listEvaluate(items, [], variables, variable, propertyCopy, param);
                }
            }
            newParameters[property] = propertyCopy;
        }
        else {
            newParameters[property] = parameters[property];
        }
    }

    return newParameters;
}

function parseParameters(parameters, items, initialItems, param) {
    const newParameters = [];
    console.log(parameters)
    if (items["main"]) {
        for (const item in items["main"]) {
            newParameters.push({});
            for (const property in parameters) {
                if (typeof parameters[property] === "string") {
                    console.log("is string")
                    let propertyCopy = parameters[property].slice();
                    if (propertyCopy !== undefined) {
                        let variables = propertyCopy.match(/{{s?.*?s?}}/g);
                        for (let variable in variables) {
                            console.log(variables[variable])
                            propertyCopy = evaluate(items["main"][item], initialItems, variables, variable, propertyCopy, param);
                            console.log(propertyCopy)
                        }
                    }
                    newParameters[item][property] = propertyCopy;
                } else if (Array.isArray(parameters[property])) {
                    newParameters[item][property] = parameters[property].map((prop) => {
                        return parseParameters(prop, items, initialItems, param)[0];
                    });
                } else {
                    newParameters[item][property] = parameters[property];
                }
            }
        }
        return newParameters;
    } else {
        return parameters;
    }
}

export { execute, parseListData }
