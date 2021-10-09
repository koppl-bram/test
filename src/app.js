
import React, { useContext, createContext, useState } from "react";
import {
    BrowserRouter as Router,
    Switch as RouterSwitch,
    Route,
    Redirect,
    useHistory,
    useLocation,
    useParams
} from "react-router-dom";
import { Grid } from "@material-ui/core"
import { useToast } from "@chakra-ui/react"
import { execute, parseListData } from "./execute"
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import {
    ChakraProvider,
    Stack,
    Avatar,
    AvatarBadge,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    FormLabel,
    Input,
    FormHelperText,
    FormErrorMessage,
    Switch,
    InputGroup,
    InputRightElement,
    Icon,
    Link,
    Flex,
    FormControl,
    Modal,
    ModalOverlay,
    ModalBody,
    ModalHeader,
    ModalContent,
    ModalCloseButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text,
    Image,
    Box,
    Divider,
    Button,
    RadioGroup,
    Tag,
    Badge,
    Textarea,
    Select,
    ScaleFade,
    Spinner
} from '@chakra-ui/react'
import { GoogleLogin } from "react-google-login"
import MicrosoftLogin from 'react-microsoft-login';
global.endpoint = "http://localhost:8080/api"

const App = (props) => {
    return <ChakraProvider style={{ backgroundColor: "#FCFCFC" }}>
        <ProvideAuth>
            <Router>
                <div>
                    <RouterSwitch>

                        <Route exact path="/">
                            <Page0 />
                        </Route>

                    </RouterSwitch>
                </div>
            </Router>
        </ProvideAuth>
    </ChakraProvider>;
}


const authContext = createContext();

function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

function useAuth() {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signin = cb => {
        setUser("user");
        cb();
    };

    const signout = cb => {
        setUser(null);
        cb();
    };

    return {
        user,
        signin,
        signout
    };
}

function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    let history = useHistory();
    if (!auth.user) {
        fetch(global.endpoint + '/me', {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => {
            console.log(response.status);
            if (response.status === 200) {
                console.log("Logged in")
                auth.signin(() => {
                    history.push(rest.path)
                });
            } else {
                auth.signout(() => {
                    history.push("/")
                });
            }
        }).catch((error) => {
            console.log(error);
            auth.signout(() => {
                history.push("/")
            });
        });
    }
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <></>
                )
            }
        />
    );
}

function Page0() {
    const [components, setComponents] = useState({ components: { "0": { "type": "root", "renderProps": { "height": "100%", "backgroundColor": "#FCFCFC" }, "previewRenderProps": {} }, "1": { "type": "box", "renderProps": { "in": true, "height": "60px", "backgroundColor": "#4ebc8f", "boxShadow": "md" }, "previewRenderProps": {} }, "3": { "type": "box", "renderProps": { "in": true, "direction": "column", "justify": "center", "padding": "50px", "alignItems": "center" }, "previewRenderProps": {} }, "5": { "type": "box", "renderProps": { "in": true, "maxWidth": "500px", "width": "100%" }, "previewRenderProps": {} }, "6": { "type": "box", "renderProps": { "in": true, "direction": "column", "justify": "center", "alignItems": "center", "paddingLeft": "50px", "paddingRight": "50px" }, "previewRenderProps": {} }, "7": { "type": "input", "renderProps": { "placeholder": "Amsterdam", "value": "", "fontSize": ["md", "md", "md", "md"], "isRequired": true, "label": "City", "errorMessage": "This cannot be empty", "width": "100%", "maxWidth": "500px", "fontFamily": "'Roboto', sans-serif" }, "previewRenderProps": {} }, "8": { "type": "box", "renderProps": { "in": true, "maxWidth": "500px", "width": "100%", "direction": "row-reverse", "paddingTop": "15px" }, "previewRenderProps": {} }, "9": { "type": "button", "renderProps": { "text": "Submit", "fontSize": ["md", "md", "md", "md"], "colorScheme": "whatsapp", "variant": "solid", "data": [{ "id": "2482038", "type": "kopplNode", "position": { "x": 504, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Get property of UI components", "name": "ui_get", "category": ["ui", "util"], "description": "This node gets properties of UI component such as \"value\" or \"color\"", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "7", "property": "value", "key": "city" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "json key", "name": "key", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "7368548", "type": "kopplNode", "position": { "x": 776, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 123 }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "2482038", "sourceHandle": "main", "target": "7368548", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-2482038main-7368548main" }, { "id": "4275503", "type": "kopplNode", "position": { "x": 1560, "y": 218 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "10", "property": "text", "value": "It is ☀️{{ item.main.temp }}°C in {{ item.name }}." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "1494737", "type": "kopplNode", "position": { "x": 1016, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "If city not found", "name": "ui_if", "category": ["action", "util"], "description": "If/Else based logic", "inputs": ["main"], "img": "https://i.imgur.com/8NNoXKe.png", "outputs": ["true", "false"], "parameters": [{ "displayName": "Variable", "name": "var", "type": "string", "required": true, "description": "", "value": "{{ item.cod }}" }, { "displayName": "Operator", "name": "operator", "type": "string", "options": ["Exists", "Equals", "Not Equals", "Greater than", "Smaller than"], "required": true, "value": "Not Equals", "description": "Determine the operator" }, { "displayName": "Value", "name": "value", "type": "string", "required": true, "description": "", "value": "404" }], "version": 1, "results": [] } }, { "source": "7368548", "sourceHandle": "main", "target": "1494737", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-7368548main-1494737main" }, { "id": "1582304", "type": "kopplNode", "position": { "x": 1192, "y": 346 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "10", "property": "text", "value": "I've never heard of this city..." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "1494737", "sourceHandle": "false", "target": "1582304", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1494737false-1582304main" }, { "id": "6099417", "type": "kopplNode", "position": { "x": 1208, "y": 218.00000000000003 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "If condition", "name": "ui_if", "category": ["action", "util"], "description": "If/Else based logic", "inputs": ["main"], "img": "https://i.imgur.com/8NNoXKe.png", "outputs": ["true", "false"], "parameters": [{ "displayName": "Variable", "name": "var", "type": "string", "required": true, "description": "", "value": "{{ item.main.temp }}" }, { "displayName": "Operator", "name": "operator", "type": "string", "options": ["Exists", "Equals", "Not Equals", "Greater than", "Smaller than"], "required": true, "value": "Smaller than", "description": "Determine the operator" }, { "displayName": "Value", "name": "value", "type": "string", "required": true, "description": "", "value": "{{ 0 }}" }], "version": 1, "results": [] } }, { "source": "1494737", "sourceHandle": "true", "target": "6099417", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1494737true-6099417main" }, { "id": "6385442", "type": "kopplNode", "position": { "x": 1368, "y": 282 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "If condition", "name": "ui_if", "category": ["action", "util"], "description": "If/Else based logic", "inputs": ["main"], "img": "https://i.imgur.com/8NNoXKe.png", "outputs": ["true", "false"], "parameters": [{ "displayName": "Variable", "name": "var", "type": "string", "required": true, "description": "", "value": "{{ item.main.temp }}" }, { "displayName": "Operator", "name": "operator", "type": "string", "options": ["Exists", "Equals", "Not Equals", "Greater than", "Smaller than"], "required": true, "value": "Greater than", "description": "Determine the operator" }, { "displayName": "Value", "name": "value", "type": "string", "required": true, "description": "", "value": "25" }], "version": 1, "results": [] } }, { "source": "6099417", "sourceHandle": "false", "target": "6385442", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6099417false-6385442main" }, { "source": "6385442", "sourceHandle": "true", "target": "4275503", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6385442true-4275503main" }, { "id": "3704490", "type": "kopplNode", "position": { "x": 1560, "y": 346 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "property": "text", "id": "10", "value": "It is {{ item.main.temp }}°C in {{ item.name }}." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "6385442", "sourceHandle": "false", "target": "3704490", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6385442false-3704490main" }, { "id": "3428421", "type": "kopplNode", "position": { "x": 1560, "y": 90 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "10", "property": "text", "value": "It is ❄️{{ item.main.temp }}°C in {{ item.name }}." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "6099417", "sourceHandle": "true", "target": "3428421", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6099417true-3428421main" }, { "id": "1675932", "type": "kopplNode", "position": { "x": 280, "y": 298 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Validate UI components", "name": "ui_validate", "category": ["ui", "util"], "description": "This node checks UI components if they are valid", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Ids", "name": "ids", "type": "array", "value": [{ "id": "7" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }] }], "outputs": ["main", "error"], "version": 1, "results": [] } }, { "source": "1675932", "sourceHandle": "main", "target": "2482038", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1675932main-2482038main" }, { "id": "2715230", "type": "kopplNode", "position": { "x": 504, "y": 378 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Pop up notification", "name": "ui_toast", "category": ["ui", "util"], "description": "This shows a pop up notification.", "inputs": ["main"], "img": "https://i.imgur.com/CFFU6r9.png", "parameters": [{ "displayName": "title", "name": "title", "type": "string", "required": true, "value": "Please fill in a city name" }, { "displayName": "description", "name": "description", "type": "string", "required": true, "value": "" }, { "displayName": "status", "name": "status", "type": "string", "required": true, "options": ["success", "info", "warning", "error"], "value": "error" }, { "displayName": "duration in ms", "name": "duration", "type": "number", "required": true, "value": "3000" }, { "displayName": "position", "name": "position", "type": "string", "required": true, "options": ["top", "top-right", "top-left", "bottom", "bottom-right", "bottom-left"], "value": "bottom-right" }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "1675932", "sourceHandle": "error", "target": "2715230", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1675932error-2715230main" }, { "id": "6189020", "type": "kopplNode", "position": { "x": 56, "y": 298 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "11", "property": "hidden", "value": "{{ false }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "6189020", "sourceHandle": "main", "target": "1675932", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6189020main-1675932main" }, { "id": "2168086", "type": "kopplNode", "position": { "x": 504, "y": 490 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "11", "property": "hidden", "value": "{{ true}}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "9503837", "type": "kopplNode", "position": { "x": 1016, "y": 106 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "11", "property": "hidden", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "7368548", "sourceHandle": "main", "target": "9503837", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-7368548main-9503837main" }], "backgroundColor": "#4ebc8f", "fontFamily": "'Noto Sans'" }, "previewRenderProps": {} }, "10": { "type": "text", "renderProps": { "text": "search for a city!", "fontSize": ["3xl", "3xl", "3xl", "3xl"], "fontFamily": "'Noto Sans'" }, "previewRenderProps": {} }, "11": { "type": "spinner", "renderProps": { "speed": "0.5s", "size": "xl", "thickness": "4px", "marginRight": "25px" }, "previewRenderProps": { "hidden": true } } } });
    const toast = useToast();
    const history = useHistory();
    const auth = useAuth();
    const { param } = useParams()

    const onClick9 = (data) => {
        let executionInstructions = [{ "id": "2482038", "data": { "displayName": "Get property of UI components", "name": "ui_get", "category": ["ui", "util"], "description": "This node gets properties of UI component such as \"value\" or \"color\"", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "7", "property": "value", "key": "city" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "json key", "name": "key", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "7368548", "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 123 }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "2482038", "sourceHandle": "main", "target": "7368548", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-2482038main-7368548main" }, { "id": "4275503", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "10", "property": "text", "value": "It is ☀️{{ item.main.temp }}°C in {{ item.name }}." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "1494737", "data": { "displayName": "If city not found", "name": "ui_if", "category": ["action", "util"], "description": "If/Else based logic", "inputs": ["main"], "img": "https://i.imgur.com/8NNoXKe.png", "outputs": ["true", "false"], "parameters": [{ "displayName": "Variable", "name": "var", "type": "string", "required": true, "description": "", "value": "{{ item.cod }}" }, { "displayName": "Operator", "name": "operator", "type": "string", "options": ["Exists", "Equals", "Not Equals", "Greater than", "Smaller than"], "required": true, "value": "Not Equals", "description": "Determine the operator" }, { "displayName": "Value", "name": "value", "type": "string", "required": true, "description": "", "value": "404" }], "version": 1, "results": [] } }, { "source": "7368548", "sourceHandle": "main", "target": "1494737", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-7368548main-1494737main" }, { "id": "1582304", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "10", "property": "text", "value": "I've never heard of this city..." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "1494737", "sourceHandle": "false", "target": "1582304", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1494737false-1582304main" }, { "id": "6099417", "data": { "displayName": "If condition", "name": "ui_if", "category": ["action", "util"], "description": "If/Else based logic", "inputs": ["main"], "img": "https://i.imgur.com/8NNoXKe.png", "outputs": ["true", "false"], "parameters": [{ "displayName": "Variable", "name": "var", "type": "string", "required": true, "description": "", "value": "{{ item.main.temp }}" }, { "displayName": "Operator", "name": "operator", "type": "string", "options": ["Exists", "Equals", "Not Equals", "Greater than", "Smaller than"], "required": true, "value": "Smaller than", "description": "Determine the operator" }, { "displayName": "Value", "name": "value", "type": "string", "required": true, "description": "", "value": "{{ 0 }}" }], "version": 1, "results": [] } }, { "source": "1494737", "sourceHandle": "true", "target": "6099417", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1494737true-6099417main" }, { "id": "6385442", "data": { "displayName": "If condition", "name": "ui_if", "category": ["action", "util"], "description": "If/Else based logic", "inputs": ["main"], "img": "https://i.imgur.com/8NNoXKe.png", "outputs": ["true", "false"], "parameters": [{ "displayName": "Variable", "name": "var", "type": "string", "required": true, "description": "", "value": "{{ item.main.temp }}" }, { "displayName": "Operator", "name": "operator", "type": "string", "options": ["Exists", "Equals", "Not Equals", "Greater than", "Smaller than"], "required": true, "value": "Greater than", "description": "Determine the operator" }, { "displayName": "Value", "name": "value", "type": "string", "required": true, "description": "", "value": "25" }], "version": 1, "results": [] } }, { "source": "6099417", "sourceHandle": "false", "target": "6385442", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6099417false-6385442main" }, { "source": "6385442", "sourceHandle": "true", "target": "4275503", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6385442true-4275503main" }, { "id": "3704490", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "property": "text", "id": "10", "value": "It is {{ item.main.temp }}°C in {{ item.name }}." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "6385442", "sourceHandle": "false", "target": "3704490", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6385442false-3704490main" }, { "id": "3428421", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "10", "property": "text", "value": "It is ❄️{{ item.main.temp }}°C in {{ item.name }}." }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "6099417", "sourceHandle": "true", "target": "3428421", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6099417true-3428421main" }, { "id": "1675932", "data": { "displayName": "Validate UI components", "name": "ui_validate", "category": ["ui", "util"], "description": "This node checks UI components if they are valid", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Ids", "name": "ids", "type": "array", "value": [{ "id": "7" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }] }], "outputs": ["main", "error"], "version": 1, "results": [] } }, { "source": "1675932", "sourceHandle": "main", "target": "2482038", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1675932main-2482038main" }, { "id": "2715230", "data": { "displayName": "Pop up notification", "name": "ui_toast", "category": ["ui", "util"], "description": "This shows a pop up notification.", "inputs": ["main"], "img": "https://i.imgur.com/CFFU6r9.png", "parameters": [{ "displayName": "title", "name": "title", "type": "string", "required": true, "value": "Please fill in a city name" }, { "displayName": "description", "name": "description", "type": "string", "required": true, "value": "" }, { "displayName": "status", "name": "status", "type": "string", "required": true, "options": ["success", "info", "warning", "error"], "value": "error" }, { "displayName": "duration in ms", "name": "duration", "type": "number", "required": true, "value": "3000" }, { "displayName": "position", "name": "position", "type": "string", "required": true, "options": ["top", "top-right", "top-left", "bottom", "bottom-right", "bottom-left"], "value": "bottom-right" }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "1675932", "sourceHandle": "error", "target": "2715230", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-1675932error-2715230main" }, { "id": "6189020", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "11", "property": "hidden", "value": "{{ false }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "6189020", "sourceHandle": "main", "target": "1675932", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-6189020main-1675932main" }, { "id": "2168086", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "11", "property": "hidden", "value": "{{ true}}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "9503837", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "11", "property": "hidden", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "7368548", "sourceHandle": "main", "target": "9503837", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-7368548main-9503837main" }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    React.useEffect(() => {
        const rootExecutions = [{ "id": "1580997", "data": { "name": "ui_change", "inputs": ["main"], "outputs": ["main"], "parameters": [{ "name": "components", "value": [{ "id": "11", "property": "hidden", "value": "{{ true }}" }] }] } }];
        execute([{}], rootExecutions, setComponents, toast, history, components)
    }, []);

    return (

        <Box  {...components.components[0].renderProps}>

            <Flex  {...components.components[1].renderProps}>

            </Flex>
            <Flex  {...components.components[3].renderProps}>

                <Flex  {...components.components[5].renderProps}>

                    <Text {...components.components[10].renderProps}>
                        {components.components[10].renderProps['text']}
                    </Text>
                </Flex>
            </Flex>
            <Flex  {...components.components[6].renderProps}>

                <FormControl
                    {...components.components[7].renderProps}
                    isInvalid={components.components[7].renderProps["regex"] && components.components[7].renderProps["value"] ? !components.components[7].renderProps["value"].match(new RegExp(components.components[7].renderProps["regex"], "s")) || (components.components[7].renderProps["isRequired"] && (components.components[7].renderProps["value"] === undefined || components.components[7].renderProps["value"] === "")) : (components.components[7].renderProps["isRequired"] && (components.components[7].renderProps["value"] === undefined || components.components[7].renderProps["value"] === ""))}
                >
                    {components.components[7].renderProps["label"] && <FormLabel>{components.components[7].renderProps["label"]}</FormLabel>}
                    <Input
                        placeholder={components.components[7].renderProps["placeholder"]}
                        variant={components.components[7].renderProps["variant"]}
                        size={components.components[7].renderProps["size"]}
                        value={components.components[7].renderProps["value"]}


                        type={components.components[7].renderProps["isPassword"] ? "password" : "text"}
                        onChange={(e) => {
                            setComponents((old) => { old.components[7].renderProps["value"] = e.target.value; return { ...old }; });
                            if (onChange_7) {
                                execute([{}], onChange_7, setComponents, toast, history, components);
                            }
                        }}
                    />
                    <FormErrorMessage>{components.components[7].renderProps["errorMessage"]}</FormErrorMessage>
                </FormControl>
                <Flex  {...components.components[8].renderProps}>

                    <Button  {...components.components[9].renderProps} onClick={() => { onClick9({}) }}>
                        {components.components[9].renderProps['text']}
                    </Button>
                    <Spinner {...components.components[11].renderProps} />
                </Flex>
            </Flex>
        </Box>
    );
}

export default App;
