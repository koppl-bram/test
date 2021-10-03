import { ExecuteWorkflowNode } from "../nodes/ExecuteWorkflowNode"
import { SetRenderPropNode } from "../nodes/SetRenderPropNode"
import { GetRenderPropNode } from "../nodes/GetRenderPropNode"
import { GoToPageNode } from "../nodes/GoToPageNode";
import { RefreshComponentNode } from "../nodes/RefreshComponentNode";
import { WaitNode } from "../nodes/WaitNode";
import { ValidateNode } from "../nodes/ValidateNode";
import { ToastNode } from "../nodes/ToastNode";
import { IfElseNode } from "../nodes/IfElseNode";

const toposort = require('toposort')

async function execute(initialItems, data, setJsxModel, setCurrentAppPage, appPages, jsxModel, toast, id) {
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
            // @ts-ignore
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
            items = await executeNode(initialItems, sortedNodes[i].data, setJsxModel, items, setCurrentAppPage, appPages, jsxModel, toast);
            obj[sortedNodes[i]['id']] = items;
        }
        items = {}
    }
    data = data.map((node) => {
        if (obj[node.id]) {
            node.results = obj[node.id]
            node.data.results = obj[node.id]
        } else {
            if (node.results) {
                node.results = []
                node.data.results = []
            }
        }
        return node;
    });
}


async function executeNode(initialItems, data, setJsxModel, items, setCurrentAppPage, appPages, jsxModel, toast) {
    let newParams = {}
    data.parameters.map((param) => {
        newParams[param['name']] = param['value']
        if (param['value'] === "false") {
            newParams[param['name']] = false
        }
    })
    if (data.name === "ui_change") {
        return new SetRenderPropNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, false)
    }
    if (data.name === "ui_get") {
        return new GetRenderPropNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, false)
    }
    if (data.name === "ui_page") {
        return new GoToPageNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, setCurrentAppPage, appPages)
    }
    if (data.name === "ui_execute_workflow") {
        let executionflow = new ExecuteWorkflowNode()
        let tmp = await executionflow.execute(parseParameters(newParams, items, initialItems), items, initialItems)
        return tmp;
    }
    if (data.name === "ui_refresh") {
        return new RefreshComponentNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, jsxModel)
    }
    if (data.name === "ui_wait") {
        return new WaitNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, jsxModel)
    }
    if (data.name === "ui_validate") {
        return new ValidateNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, jsxModel, toast, "development")
    }
    if (data.name === "ui_toast") {
        return new ToastNode().execute(parseParameters(newParams, items, initialItems), items, toast)
    }
    if (data.name === "ui_if") {
        return new IfElseNode().execute(parseParameters(newParams, items, initialItems), items, setJsxModel, jsxModel, toast)
    }
}

function evaluate(currentItem, initialItems, variables, variable, propertyCopy) {
    try {
        const newVar = eval(
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
        if (typeof newVar === "string" && typeof propertyCopy === "string") {
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
        console.log(e)
        return ""
    }
}

function parseParameters(parameters, items, initialItems) {
    const newParameters = [];
    if (items["main"]) {
        for (const item in items["main"]) {
            newParameters.push({});
            for (const property in parameters) {
                if (typeof parameters[property] === "string") {
                    let propertyCopy = parameters[property].slice();
                    if (propertyCopy !== undefined) {
                        let variables = propertyCopy.match(/{{s?.*?s?}}/g);
                        for (let variable in variables) {
                            propertyCopy = evaluate(items["main"][item], initialItems, variables, variable, propertyCopy);
                        }
                    }
                    newParameters[item][property] = propertyCopy;
                } else if (Array.isArray(parameters[property])) {
                    newParameters[item][property] = parameters[property].map((prop) => {
                        return parseParameters(prop, items, initialItems)[0];
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

export { execute }
