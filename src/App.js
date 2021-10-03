

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

                        <Route exact path="/home">
                            <Page1 />
                        </Route>

                        <Route exact path="/view/:param">
                            <Page2 />
                        </Route>

                        <Route exact path="/demand">
                            <Page3 />
                        </Route>

                        <Route exact path="/users">
                            <Page4 />
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
    const [components, setComponents] = useState({ components: { "0": { "type": "root", "renderProps": { "height": "100%", "backgroundColor": "#FCFCFC" }, "previewRenderProps": {} }, "1": { "type": "box", "renderProps": { "in": true, "justify": "center", "alignItems": "center", "backgroundColor": "#0f238c", "boxShadow": "base" }, "previewRenderProps": {} }, "2": { "type": "image", "renderProps": { "src": "https://s3-symbol-logo.tradingview.com/asml--600.png", "height": "90px" }, "previewRenderProps": {} }, "3": { "type": "text", "renderProps": { "text": "cloud workloads", "fontSize": ["md", "md", "md", "md"], "color": "#ffffff" }, "previewRenderProps": {} }, "4": { "type": "microsoft", "renderProps": { "text": "Sign in with Microsoft", "fontSize": ["md", "md", "md", "md"], "backgroundColor": "#0f238c", "color": "#ffffff", "colorScheme": "blue" }, "previewRenderProps": {} }, "5": { "type": "box", "renderProps": { "in": true, "direction": "row", "justify": "center", "alignItems": "center", "padding": "50px" }, "previewRenderProps": {} } } });
    const toast = useToast();
    const history = useHistory();
    const auth = useAuth();
    const { param } = useParams()

    React.useEffect(() => {
    }, []);

    return (

        <Box  {...components.components[0].renderProps}>

            <Flex  {...components.components[1].renderProps}>

                <Image {...components.components[2].renderProps}>
                </Image>
                <Text {...components.components[3].renderProps}>
                    {components.components[3].renderProps['text']}
                </Text>
            </Flex>
            <Flex  {...components.components[5].renderProps}>
                <MicrosoftLogin
                    clientId={"undefined"}
                    redirectUri={"http://localhost:1234"}
                    authCallback={(err, data) => {
                        if (err) {

                            execute([{}], failedInstructions, setComponents, toast, history, components)
                        } else {
                            fetch(global.endpoint + "/token/microsoft", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ ...data, id: 36 }),
                            })
                                .then((response) => {
                                    if (response.status === 200) {
                                        response.json().then((res) => {
                                            localStorage.setItem('role', res['role']);
                                            auth.signin(() => {

                                                execute([{}], successInstructions, setComponents, toast, history, components)
                                            });
                                        });
                                    } else {

                                        execute([{}], failedInstructions, setComponents, toast, history, components)
                                    }
                                })
                        }
                    }}
                    children={<Button {...components.components[4].renderProps}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41">
                            <path fill="#f25022" d="M13 11h9v9h-9z" />
                            <path fill="#00a4ef" d="M13 21h9v9h-9z" />
                            <path fill="#7fba00" d="M23 11h9v9h-9z" />
                            <path fill="#ffb900" d="M23 21h9v9h-9z" />
                        </svg>
                        Sign in using Microsoft
                    </Button>}
                />
            </Flex>
        </Box>
    );
}


function Page1() {
    const [components, setComponents] = useState({ components: { "0": { "type": "root", "renderProps": { "height": "100%", "backgroundColor": "#FCFCFC" }, "previewRenderProps": {} }, "1": { "type": "box", "renderProps": { "in": true, "justify": "space-between", "alignItems": "center", "backgroundColor": "#0f238c", "boxShadow": "base", "direction": "row" }, "previewRenderProps": {} }, "2": { "type": "image", "renderProps": { "src": "https://s3-symbol-logo.tradingview.com/asml--600.png", "height": "90px" }, "previewRenderProps": {} }, "3": { "type": "text", "renderProps": { "text": "cloud workloads", "fontSize": ["md", "md", "md", "md"], "color": "#ffffff" }, "previewRenderProps": {} }, "5": { "type": "box", "renderProps": { "in": true, "direction": "row", "justify": "flex-start", "alignItems": "center", "padding": "50px" }, "previewRenderProps": {} }, "6": { "type": "button", "renderProps": { "text": "Logout", "fontSize": ["md", "md", "md", "md"], "data": [{ "id": "2518037", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Logs out the user", "name": "ui_user_logout", "category": ["ui", "util"], "description": "Logs out the user and redirects to the home page", "inputs": ["main"], "img": "https://i.imgur.com/nZndvLt.png", "parameters": [], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "ghost", "colorScheme": "blue" }, "previewRenderProps": {} }, "7": { "type": "box", "renderProps": { "in": true, "padding": "10px" }, "previewRenderProps": {} }, "8": { "type": "box", "renderProps": { "in": true, "alignItems": "center" }, "previewRenderProps": {} }, "9": { "type": "box", "renderProps": { "in": true, "padding": "10px", "width": "100px" }, "previewRenderProps": {} }, "10": { "type": "dataGrid", "renderProps": { "height": "600px", "width": "100%", "data": [{ "columns": [{ "field": "id", "headerName": "ID", "width": 90 }, { "field": "workload", "headerName": "Workload", "width": 150, "editable": true }, { "field": "grc", "headerName": "GRC", "width": 150, "editable": true }, { "field": "security", "headerName": "Security validation", "width": 220, "editable": true }, { "field": "risk", "headerName": "Risk go-live approval", "width": 220, "editable": true }], "rows": [{ "id": 1, "workload": "DR taipei", "grc": "yes", "security": "yes", "risk": "yes" }, { "id": 2, "workload": "DR US", "grc": "yes", "security": "no", "risk": "yes" }, { "id": 3, "workload": "ITSD", "grc": "pending", "security": "yes", "risk": "yes" }, { "id": 4, "workload": "Confluence Brion", "grc": "yes", "security": "yes", "risk": "yes" }, { "id": 5, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 6, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 7, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 8, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 9, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 10, "workload": "DR taipei", "grc": "yes", "security": "no", "risk": "no" }, { "id": 11, "workload": "DR US", "grc": "yes", "security": "no", "risk": "no" }, { "id": 12, "workload": "ITSD", "grc": "yes", "security": "no", "risk": "no" }, { "id": 13, "workload": "Confluence Brion", "grc": "yes", "security": "no", "risk": "no" }, { "id": 14, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 15, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 16, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 17, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 18, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 19, "workload": "DR taipei", "grc": "yes", "security": "no", "risk": "no" }, { "id": 20, "workload": "DR US", "grc": "yes", "security": "no", "risk": "no" }, { "id": 30, "workload": "ITSD", "grc": "yes", "security": "no", "risk": "no" }, { "id": 40, "workload": "Confluence Brion", "grc": "yes", "security": "no", "risk": "no" }, { "id": 50, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 60, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 70, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 80, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 90, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 100, "workload": "DR taipei", "grc": "yes", "security": "no", "risk": "no" }, { "id": 200, "workload": "DR US", "grc": "yes", "security": "no", "risk": "no" }, { "id": 300, "workload": "ITSD", "grc": "yes", "security": "no", "risk": "no" }, { "id": 400, "workload": "Confluence Brion", "grc": "yes", "security": "no", "risk": "no" }, { "id": 500, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 600, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 700, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 800, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 900, "workload": "", "grc": "yes", "security": "no", "risk": "no" }] }], "density": "standard", "workflowId": 117, "_onClick": [{ "id": "5309199", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "results": [], "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Go to page", "name": "ui_page", "category": ["ui", "util"], "description": "This nodes brings the user to a different page", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Page path", "name": "id", "type": "string", "required": true, "value": "/view/" }, { "displayName": "Page param", "name": "param", "type": "string", "required": true, "value": "{{item.id}}" }], "outputs": ["main"], "version": 1 } }] }, "previewRenderProps": {} }, "11": { "type": "box", "renderProps": { "in": true, "paddingTop": "0px", "paddingLeft": "25px", "paddingRight": "25px", "paddingBottom": "25px" }, "previewRenderProps": {} }, "12": { "type": "button", "renderProps": { "text": "new workload", "fontSize": ["md", "md", "md", "md"], "colorScheme": "blue", "backgroundColor": "#0f238c", "data": [{ "id": "2480055", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "13", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": { "main": [{}] } }, "results": { "main": [{}] } }] }, "previewRenderProps": {} }, "13": { "type": "modal", "renderProps": { "isOpen": false, "size": "lg" }, "previewRenderProps": { "isOpen": false } }, "14": { "type": "input", "renderProps": { "placeholder": "workload", "value": "", "fontSize": ["md", "md", "md", "md"], "isRequired": true, "errorMessage": "The workload name cannot be empty", "variant": "flushed", "label": "Workload name", "marginTop": "20px" }, "previewRenderProps": {} }, "15": { "type": "button", "renderProps": { "text": "Create", "fontSize": ["md", "md", "md", "md"], "colorScheme": "blue", "backgroundColor": "#0f238c" }, "previewRenderProps": {} }, "16": { "type": "box", "renderProps": { "in": true, "direction": "row-reverse" }, "previewRenderProps": {} }, "17": { "type": "input", "renderProps": { "value": "", "fontSize": ["md", "md", "md", "md"], "isRequired": true, "errorMessage": "The owner name cannot be empty", "variant": "flushed", "marginTop": "20px", "label": "Owner", "placeholder": "first and last name" }, "previewRenderProps": {} }, "18": { "type": "text", "renderProps": { "text": "Create a new workload", "fontSize": ["2xl", "2xl", "2xl", "2xl"], "fontWeight": "bold" }, "previewRenderProps": {} }, "19": { "type": "box", "renderProps": { "in": true, "backgroundColor": "#7c7c7c", "height": "1px" }, "previewRenderProps": {} } } });
    const toast = useToast();
    const history = useHistory();
    const auth = useAuth();
    const { param } = useParams()

    const onClick6 = (data) => {
        let executionInstructions = [{ "id": "2518037", "data": { "displayName": "Logs out the user", "name": "ui_user_logout", "category": ["ui", "util"], "description": "Logs out the user and redirects to the home page", "inputs": ["main"], "img": "https://i.imgur.com/nZndvLt.png", "parameters": [], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick12 = (data) => {
        let executionInstructions = [{ "id": "2480055", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "13", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": { "main": [{}] } } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    React.useEffect(() => {
        const rootExecutions = [{ "id": "5091019", "data": { "name": "ui_toast", "inputs": ["main"], "outputs": ["main"], "parameters": [{ "name": "title", "value": "{{ param }}" }, { "name": "description", "value": "" }, { "name": "status", "value": "success" }, { "name": "duration", "value": 5000 }, { "name": "position", "value": "bottom" }] } }];
        execute([{}], rootExecutions, setComponents, toast, history, components)
    }, []);

    return (

        <Box  {...components.components[0].renderProps}>

            <Flex  {...components.components[1].renderProps}>

                <Flex  {...components.components[9].renderProps}>

                </Flex>
                <Flex  {...components.components[8].renderProps}>

                    <Image {...components.components[2].renderProps}>
                    </Image>
                    <Text {...components.components[3].renderProps}>
                        {components.components[3].renderProps['text']}
                    </Text>
                </Flex>
                <Flex  {...components.components[7].renderProps}>

                    <Button  {...components.components[6].renderProps} onClick={() => { onClick6({}) }}>
                        {components.components[6].renderProps['text']}
                    </Button>
                </Flex>
            </Flex>
            <Flex  {...components.components[5].renderProps}>

                <Button  {...components.components[12].renderProps} onClick={() => { onClick12({}) }}>
                    {components.components[12].renderProps['text']}
                </Button>
            </Flex>
            <Flex  {...components.components[11].renderProps}>

            </Flex>
            <Modal
                {...components.components[13].renderProps}
                onClose={() => {
                    setComponents((old) => {
                        let new_components = {...old}
                        new_components.components[13].renderProps.isOpen = false;
                        return new_components;
                    })
                }}>
                <ModalOverlay />
                <ModalContent {...components.components[13].renderProps}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text {...components.components[18].renderProps}>
                            {components.components[18].renderProps['text']}
                        </Text>
                        <Flex  {...components.components[19].renderProps}>

                        </Flex>
                        <FormControl
                            {...components.components[14].renderProps}
                            isInvalid={components.components[14].renderProps["regex"] && components.components[14].renderProps["value"] ? !components.components[14].renderProps["value"].match(new RegExp(components.components[14].renderProps["regex"], "s")) || (components.components[14].renderProps["isRequired"] && (components.components[14].renderProps["value"] === undefined || components.components[14].renderProps["value"] === "")) : (components.components[14].renderProps["isRequired"] && (components.components[14].renderProps["value"] === undefined || components.components[14].renderProps["value"] === ""))}
                        >
                            {components.components[14].renderProps["label"] && <FormLabel>{components.components[14].renderProps["label"]}</FormLabel>}
                            <Input
                                placeholder={components.components[14].renderProps["placeholder"]}
                                variant={components.components[14].renderProps["variant"]}
                                size={components.components[14].renderProps["size"]}
                                value={components.components[14].renderProps["value"]}


                                type={components.components[14].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[14].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_14, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[14].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            {...components.components[17].renderProps}
                            isInvalid={components.components[17].renderProps["regex"] && components.components[17].renderProps["value"] ? !components.components[17].renderProps["value"].match(new RegExp(components.components[17].renderProps["regex"], "s")) || (components.components[17].renderProps["isRequired"] && (components.components[17].renderProps["value"] === undefined || components.components[17].renderProps["value"] === "")) : (components.components[17].renderProps["isRequired"] && (components.components[17].renderProps["value"] === undefined || components.components[17].renderProps["value"] === ""))}
                        >
                            {components.components[17].renderProps["label"] && <FormLabel>{components.components[17].renderProps["label"]}</FormLabel>}
                            <Input
                                placeholder={components.components[17].renderProps["placeholder"]}
                                variant={components.components[17].renderProps["variant"]}
                                size={components.components[17].renderProps["size"]}
                                value={components.components[17].renderProps["value"]}


                                type={components.components[17].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[17].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_17, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[17].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <Flex  {...components.components[16].renderProps}>

                            <Button  {...components.components[15].renderProps}>
                                {components.components[15].renderProps['text']}
                            </Button>
                        </Flex></ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}


function Page2() {
    const [components, setComponents] = useState({ components: { "0": { "type": "root", "renderProps": { "height": "100%", "backgroundColor": "#FCFCFC" }, "previewRenderProps": {} }, "1": { "type": "box", "renderProps": { "in": true, "justify": "space-between", "alignItems": "center", "backgroundColor": "#0f238c", "boxShadow": "base", "direction": "row" }, "previewRenderProps": {} }, "2": { "type": "image", "renderProps": { "src": "https://s3-symbol-logo.tradingview.com/asml--600.png", "height": "90px" }, "previewRenderProps": {} }, "3": { "type": "text", "renderProps": { "text": "cloud workloads", "fontSize": ["md", "md", "md", "md"], "color": "#ffffff" }, "previewRenderProps": {} }, "5": { "type": "box", "renderProps": { "in": true, "direction": "row", "justify": "flex-start", "alignItems": "center", "paddingLeft": "50px", "paddingRight": "50px", "paddingTop": "20px" }, "previewRenderProps": {} }, "6": { "type": "button", "renderProps": { "text": "Logout", "fontSize": ["md", "md", "md", "md"], "data": [{ "id": "2518037", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Logs out the user", "name": "ui_user_logout", "category": ["ui", "util"], "description": "Logs out the user and redirects to the home page", "inputs": ["main"], "img": "https://i.imgur.com/nZndvLt.png", "parameters": [], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "ghost", "colorScheme": "blackAlpha", "color": "#ffffff" }, "previewRenderProps": {} }, "7": { "type": "box", "renderProps": { "in": true, "padding": "10px" }, "previewRenderProps": {} }, "8": { "type": "box", "renderProps": { "in": true, "alignItems": "center" }, "previewRenderProps": {} }, "9": { "type": "box", "renderProps": { "in": true, "padding": "10px", "width": "100px" }, "previewRenderProps": {} }, "11": { "type": "box", "renderProps": { "in": true, "paddingLeft": "50px", "paddingRight": "50px" }, "previewRenderProps": {} }, "15": { "type": "button", "renderProps": { "fontSize": ["xl", "xl", "xl", "2xl"], "data": [{ "id": "6138934", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "ghost", "colorScheme": "blue", "marginLeft": "15px", "rounded": "xs", "text": "<", "fontWeight": "bold", "fontStyle": "italic" }, "previewRenderProps": {} }, "16": { "type": "gridContainer", "renderProps": {}, "previewRenderProps": {} }, "17": { "type": "gridItem", "renderProps": { "lg": "6", "md": "6", "sm": "12", "xs": "12", "padding": "15px" }, "previewRenderProps": {} }, "19": { "type": "box", "renderProps": { "in": true, "backgroundColor": "#ffffff", "direction": "column", "boxShadow": "base", "padding": "15px" }, "previewRenderProps": {} }, "20": { "type": "text", "renderProps": { "text": "Stakeholder overview", "fontSize": ["lg", "lg", "xl", "xl"], "fontWeight": "bold", "textDecoration": "underline" }, "previewRenderProps": {} }, "21": { "type": "text", "renderProps": { "text": "Current phase: Intake", "fontSize": ["md", "md", "md", "md"], "fontWeight": "bold", "fontFamily": "'Noto Sans'" }, "previewRenderProps": {} }, "31": { "type": "box", "renderProps": { "in": true, "alignItems": "center", "direction": "row", "justify": "space-between" }, "previewRenderProps": {} }, "32": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "33": { "type": "text", "renderProps": { "text": "Funder", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "34": { "type": "text", "renderProps": { "text": "Rob van Megen", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "35": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "36": { "type": "text", "renderProps": { "text": "Cost Manager", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "37": { "type": "text", "renderProps": { "text": "Joey van Duijnhoven", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "38": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "39": { "type": "text", "renderProps": { "text": "Sector Risk Manager", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "40": { "type": "text", "renderProps": { "text": "Don Mulders", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "41": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "42": { "type": "text", "renderProps": { "text": "Technology Application Security", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "43": { "type": "text", "renderProps": { "text": "N/A", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "44": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "45": { "type": "text", "renderProps": { "text": "Key end-user", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "46": { "type": "text", "renderProps": { "text": "Don Mulders", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "47": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "48": { "type": "text", "renderProps": { "text": "CCoE solutions architect", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "49": { "type": "text", "renderProps": { "text": "Bram Mulders", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "50": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "51": { "type": "text", "renderProps": { "text": "CCoE security architect", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "52": { "type": "text", "renderProps": { "text": "Frank Peeters", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "53": { "type": "button", "renderProps": { "text": "Edit", "fontSize": ["md", "md", "md", "md"], "data": [{ "id": "6138934", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "outline", "colorScheme": "blue", "marginLeft": "15px", "rounded": "xs", "boxShadow": "base", "size": "sm" }, "previewRenderProps": {} }, "54": { "type": "box", "renderProps": { "in": true, "justify": "flex-start", "alignItems": "flex-start", "direction": "column", "paddingLeft": "50px", "paddingRight": "50px", "marginTop": "15px", "marginBottom": "15px" }, "previewRenderProps": {} }, "55": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "56": { "type": "text", "renderProps": { "text": "Business Owner", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "57": { "type": "text", "renderProps": { "text": "Patrick van Velsen", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "58": { "type": "text", "renderProps": { "text": "workload", "fontSize": ["4xl", "4xl", "4xl", "4xl"], "fontWeight": "bold", "fontFamily": "'Noto Sans'" }, "previewRenderProps": {} }, "59": { "type": "box", "renderProps": { "in": true, "justify": "flex-start", "alignItems": "center", "marginTop": "15px" }, "previewRenderProps": {} }, "60": { "type": "text", "renderProps": { "text": "Metadata", "fontSize": ["md", "md", "md", "md"], "paddingLeft": "50px", "fontWeight": "bold", "fontFamily": "'Noto Sans'" }, "previewRenderProps": {} }, "62": { "type": "box", "renderProps": { "in": true, "justify": "flex-start", "alignItems": "center" }, "previewRenderProps": {} }, "74": { "type": "box", "renderProps": { "in": true, "justify": "flex-start", "alignItems": "flex-start", "direction": "column", "paddingLeft": "50px", "paddingRight": "50px", "marginTop": "15px" }, "previewRenderProps": {} }, "75": { "type": "text", "renderProps": { "text": "Open tasks", "fontSize": ["md", "md", "md", "md"], "fontWeight": "bold", "fontFamily": "'Noto Sans'" }, "previewRenderProps": {} }, "76": { "type": "box", "renderProps": { "in": true, "justify": "flex-start", "alignItems": "center" }, "previewRenderProps": {} }, "77": { "type": "gridContainer", "renderProps": {}, "previewRenderProps": {} }, "78": { "type": "button", "renderProps": { "text": "Submit GRC", "fontSize": ["sm", "sm", "sm", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px", "data": [{ "id": "7434707", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "117", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }] }, "previewRenderProps": {} }, "79": { "type": "button", "renderProps": { "text": "Fill in business context", "fontSize": ["md", "md", "md", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px", "data": [{ "id": "5343123", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "122", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }] }, "previewRenderProps": {} }, "80": { "type": "button", "renderProps": { "text": "Complete cost mgt. intro", "fontSize": ["md", "md", "md", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px", "data": [], "isDisabled": false }, "previewRenderProps": {} }, "81": { "type": "button", "renderProps": { "text": "Submit DTA environment request", "fontSize": ["md", "md", "md", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px" }, "previewRenderProps": {} }, "83": { "type": "button", "renderProps": { "text": "Fill in data sources", "fontSize": ["md", "md", "md", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px" }, "previewRenderProps": {} }, "84": { "type": "text", "renderProps": { "text": "In this phase, we are gathering all information related to governance, risk and compliance to ensure business continuity for ASML.", "fontSize": ["md", "md", "md", "md"] }, "previewRenderProps": {} }, "85": { "type": "box", "renderProps": { "in": true, "direction": "row", "width": "100%", "height": "1px", "backgroundColor": "#949494" }, "previewRenderProps": {} }, "86": { "type": "box", "renderProps": { "in": true, "direction": "row", "width": "100%", "height": "1px", "backgroundColor": "#949494" }, "previewRenderProps": {} }, "87": { "type": "gridItem", "renderProps": { "lg": "6", "md": "6", "sm": "12", "xs": "12", "padding": "15px" }, "previewRenderProps": {} }, "88": { "type": "box", "renderProps": { "in": true, "backgroundColor": "#ffffff", "direction": "column", "boxShadow": "base", "padding": "15px" }, "previewRenderProps": {} }, "89": { "type": "box", "renderProps": { "in": true, "alignItems": "center", "direction": "row", "justify": "space-between" }, "previewRenderProps": {} }, "90": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "91": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "92": { "type": "box", "renderProps": { "in": true }, "previewRenderProps": {} }, "94": { "type": "box", "renderProps": { "in": true, "direction": "column", "paddingTop": "15px" }, "previewRenderProps": {} }, "98": { "type": "text", "renderProps": { "text": "Cost management", "fontSize": ["lg", "lg", "xl", "xl"], "fontWeight": "bold", "textDecoration": "underline" }, "previewRenderProps": {} }, "99": { "type": "button", "renderProps": { "text": "Edit", "fontSize": ["md", "md", "md", "md"], "data": [{ "id": "6138934", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "outline", "colorScheme": "blue", "marginLeft": "15px", "rounded": "xs", "boxShadow": "base", "size": "sm" }, "previewRenderProps": {} }, "100": { "type": "text", "renderProps": { "text": "Cost center", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "101": { "type": "text", "renderProps": { "text": "Patrick van Velsen", "fontSize": ["md", "md", "md", "md"], "width": "50%", "textAlign": "right" }, "previewRenderProps": {} }, "102": { "type": "text", "renderProps": { "text": "Budget confirmation", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "104": { "type": "text", "renderProps": { "text": "Cost monitored by", "fontSize": ["md", "md", "md", "md"], "width": "50%" }, "previewRenderProps": {} }, "105": { "type": "text", "renderProps": { "text": "Roel Thijssen", "fontSize": ["md", "md", "md", "md"], "width": "50%", "textAlign": "right" }, "previewRenderProps": {} }, "116": { "type": "button", "renderProps": { "text": "Request approval from Funder", "fontSize": ["md", "md", "md", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px" }, "previewRenderProps": {} }, "117": { "type": "modal", "renderProps": { "isOpen": false, "size": "lg", "rounded": "xs" }, "previewRenderProps": {} }, "118": { "type": "text", "renderProps": { "text": "Fill in this word document:", "fontSize": ["md", "md", "md", "md"] }, "previewRenderProps": {} }, "119": { "type": "link", "renderProps": { "text": "GRC document", "isExternal": false, "color": "#2b50e5", "textDecoration": "underline" }, "previewRenderProps": {} }, "120": { "type": "text", "renderProps": { "text": "Then upload it here", "fontSize": ["md", "md", "md", "md"] }, "previewRenderProps": {} }, "121": { "type": "button", "renderProps": { "text": "Upload", "fontSize": ["md", "md", "md", "md"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px", "data": [{ "id": "3759926", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "78", "property": "hidden", "value": "{{ true }}" }, { "id": "117", "property": "isOpen", "value": "{{ false }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "4444774", "type": "kopplNode", "position": { "x": 808, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Pop up notification", "name": "ui_toast", "category": ["ui", "util"], "description": "This shows a pop up notification.", "inputs": ["main"], "img": "https://i.imgur.com/CFFU6r9.png", "parameters": [{ "displayName": "title", "name": "title", "type": "string", "required": true, "value": "Succesfully submited the GRC" }, { "displayName": "description", "name": "description", "type": "string", "required": true, "value": "" }, { "displayName": "status", "name": "status", "type": "string", "required": true, "options": ["success", "info", "warning", "error"], "value": "success" }, { "displayName": "duration in ms", "name": "duration", "type": "number", "required": true, "value": 5000 }, { "displayName": "position", "name": "position", "type": "string", "required": true, "options": ["top", "top-right", "top-left", "bottom", "bottom-right", "bottom-left"], "value": "bottom" }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "3759926", "sourceHandle": "main", "target": "4444774", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-3759926main-4444774main" }] }, "previewRenderProps": {} }, "122": { "type": "modal", "renderProps": { "isOpen": false, "size": "lg", "rounded": "xs" }, "previewRenderProps": {} }, "123": { "type": "textarea", "renderProps": { "text": "sample text", "value": "", "fontSize": ["md", "md", "md", "md"], "label": "Organizational structure", "placeholder": "Please provide the name of your sector, department/ART and team", "isRequired": true }, "previewRenderProps": {} }, "124": { "type": "textarea", "renderProps": { "text": "sample text", "value": "", "fontSize": ["md", "md", "md", "md"], "label": "Background service", "placeholder": "Please describe the service your are planning to deliver for ASML", "isRequired": true }, "previewRenderProps": {} }, "125": { "type": "textarea", "renderProps": { "text": "sample text", "value": "", "fontSize": ["md", "md", "md", "md"], "label": "Problem statement", "placeholder": "Please describe what this service will solve", "isRequired": true }, "previewRenderProps": {} }, "126": { "type": "button", "renderProps": { "text": "Provide list of engineers", "fontSize": ["md", "md", "md", "sm"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px" }, "previewRenderProps": {} }, "127": { "type": "textarea", "renderProps": { "text": "sample text", "value": "", "fontSize": ["md", "md", "md", "md"], "label": "Scope", "placeholder": "Please define the scope and critical success factors", "isRequired": true }, "previewRenderProps": {} }, "128": { "type": "button", "renderProps": { "fontSize": ["md", "md", "md", "md"], "size": "sm", "colorScheme": "blue", "backgroundColor": "#0f238c", "rounded": "xs", "boxShadow": "md", "margin": "10px", "text": "Submit" }, "previewRenderProps": {} }, "129": { "type": "box", "renderProps": { "in": true, "direction": "row-reverse" }, "previewRenderProps": {} }, "130": { "type": "text", "renderProps": { "text": "no", "fontSize": ["md", "md", "md", "md"], "width": "50%", "textAlign": "right" }, "previewRenderProps": {} }, "131": { "type": "link", "renderProps": { "text": "GCP cost calculator", "isExternal": false, "color": "#2b50e5", "textDecoration": "underline" }, "previewRenderProps": {} }, "132": { "type": "link", "renderProps": { "text": "Azure cost calculator", "isExternal": false, "color": "#2b50e5", "textDecoration": "underline" }, "previewRenderProps": {} }, "133": { "type": "button", "renderProps": { "text": "Edit", "fontSize": ["md", "md", "md", "md"], "data": [{ "id": "6138934", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "outline", "colorScheme": "blue", "marginLeft": "15px", "rounded": "xs", "boxShadow": "base" }, "previewRenderProps": {} } } });
    const toast = useToast();
    const history = useHistory();
    const auth = useAuth();
    const { param } = useParams()

    const onClick6 = (data) => {
        let executionInstructions = [{ "id": "2518037", "data": { "displayName": "Logs out the user", "name": "ui_user_logout", "category": ["ui", "util"], "description": "Logs out the user and redirects to the home page", "inputs": ["main"], "img": "https://i.imgur.com/nZndvLt.png", "parameters": [], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick15 = (data) => {
        let executionInstructions = [{ "id": "6138934", "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick53 = (data) => {
        let executionInstructions = [{ "id": "6138934", "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick78 = (data) => {
        let executionInstructions = [{ "id": "7434707", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "117", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick79 = (data) => {
        let executionInstructions = [{ "id": "5343123", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "122", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick80 = (data) => {
        let executionInstructions = [];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick99 = (data) => {
        let executionInstructions = [{ "id": "6138934", "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick121 = (data) => {
        let executionInstructions = [{ "id": "3759926", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "78", "property": "hidden", "value": "{{ true }}" }, { "id": "117", "property": "isOpen", "value": "{{ false }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }, { "id": "4444774", "data": { "displayName": "Pop up notification", "name": "ui_toast", "category": ["ui", "util"], "description": "This shows a pop up notification.", "inputs": ["main"], "img": "https://i.imgur.com/CFFU6r9.png", "parameters": [{ "displayName": "title", "name": "title", "type": "string", "required": true, "value": "Succesfully submited the GRC" }, { "displayName": "description", "name": "description", "type": "string", "required": true, "value": "" }, { "displayName": "status", "name": "status", "type": "string", "required": true, "options": ["success", "info", "warning", "error"], "value": "success" }, { "displayName": "duration in ms", "name": "duration", "type": "number", "required": true, "value": 5000 }, { "displayName": "position", "name": "position", "type": "string", "required": true, "options": ["top", "top-right", "top-left", "bottom", "bottom-right", "bottom-left"], "value": "bottom" }], "outputs": ["main"], "version": 1, "results": [] } }, { "source": "3759926", "sourceHandle": "main", "target": "4444774", "targetHandle": "main", "stroke": "#AAA", "arrowHeadType": "arrowclosed", "type": "kopplEdge", "id": "reactflow__edge-3759926main-4444774main" }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick133 = (data) => {
        let executionInstructions = [{ "id": "6138934", "data": { "displayName": "Execute an automation workflow", "name": "ui_execute_workflow", "category": ["ui", "util"], "description": "This nodes changes any UI component", "inputs": ["main"], "img": "https://i.imgur.com/JJ46eFt.png", "parameters": [{ "displayName": "Workflow id", "name": "id", "type": "workflow", "required": true, "value": 118 }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    React.useEffect(() => {
        const rootExecutions = [{ "id": "9532191", "data": { "name": "ui_execute_workflow", "inputs": ["main"], "outputs": ["main"], "parameters": [{ "name": "id", "value": 118 }] } }, { "id": "5997458", "data": { "name": "ui_change", "inputs": ["main"], "outputs": ["main"], "parameters": [{ "name": "components", "value": [{ "id": "58", "property": "text", "value": "{{ param }}" }] }] } }, { "source": "5997458", "target": "9532191", "id": "reactflow__edge-5997458main-9532191main", "sourceHandle": "main", "targetHandle": "main" }];
        execute([{}], rootExecutions, setComponents, toast, history, components, param)
    }, []);

    return (

        <Box  {...components.components[0].renderProps}>

            <Flex  {...components.components[1].renderProps}>

                <Flex  {...components.components[9].renderProps}>

                </Flex>
                <Flex  {...components.components[8].renderProps}>

                    <Image {...components.components[2].renderProps}>
                    </Image>
                    <Text {...components.components[3].renderProps}>
                        {components.components[3].renderProps['text']}
                    </Text>
                </Flex>
                <Flex  {...components.components[7].renderProps}>

                    <Button  {...components.components[6].renderProps} onClick={() => { onClick6({}) }}>
                        {components.components[6].renderProps['text']}
                    </Button>
                </Flex>
            </Flex>
            <Flex  {...components.components[5].renderProps}>

                <Button  {...components.components[15].renderProps} onClick={() => { onClick15({}) }}>
                    {components.components[15].renderProps['text']}
                </Button>
                <Text {...components.components[58].renderProps}>
                    {components.components[58].renderProps['text']}
                </Text>
                <Button  {...components.components[133].renderProps} onClick={() => { onClick133({}) }}>
                    {components.components[133].renderProps['text']}
                </Button>
            </Flex>
            <Flex  {...components.components[54].renderProps}>

                <Text {...components.components[21].renderProps}>
                    {components.components[21].renderProps['text']}
                </Text>
                <Flex  {...components.components[62].renderProps}>

                    <Text {...components.components[84].renderProps}>
                        {components.components[84].renderProps['text']}
                    </Text>
                </Flex>
                <Flex  {...components.components[85].renderProps}>

                </Flex>
            </Flex>
            <Flex  {...components.components[74].renderProps}>

                <Text {...components.components[75].renderProps}>
                    {components.components[75].renderProps['text']}
                </Text>
                <Flex  {...components.components[76].renderProps}>

                    <Grid
                        container
                        style={{}}
                    >

                        <Button  {...components.components[78].renderProps} onClick={() => { onClick78({}) }}>
                            {components.components[78].renderProps['text']}
                        </Button>
                        <Button  {...components.components[79].renderProps} onClick={() => { onClick79({}) }}>
                            {components.components[79].renderProps['text']}
                        </Button>
                        <Button  {...components.components[80].renderProps} onClick={() => { onClick80({}) }}>
                            {components.components[80].renderProps['text']}
                        </Button>
                        <Button  {...components.components[81].renderProps}>
                            {components.components[81].renderProps['text']}
                        </Button>
                        <Button  {...components.components[83].renderProps}>
                            {components.components[83].renderProps['text']}
                        </Button>
                        <Button  {...components.components[116].renderProps}>
                            {components.components[116].renderProps['text']}
                        </Button>
                        <Button  {...components.components[126].renderProps}>
                            {components.components[126].renderProps['text']}
                        </Button>
                    </Grid>
                </Flex>
                <Flex  {...components.components[86].renderProps}>

                </Flex>
            </Flex>
            <Flex  {...components.components[59].renderProps}>

                <Text {...components.components[60].renderProps}>
                    {components.components[60].renderProps['text']}
                </Text>
            </Flex>
            <Flex  {...components.components[11].renderProps}>

                <Grid
                    container
                    style={{}}
                >

                    <Grid
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        padding={"15px"}

                    >

                        <Flex  {...components.components[19].renderProps}>

                            <Flex  {...components.components[31].renderProps}>

                                <Text {...components.components[20].renderProps}>
                                    {components.components[20].renderProps['text']}
                                </Text>
                                <Button  {...components.components[53].renderProps} onClick={() => { onClick53({}) }}>
                                    {components.components[53].renderProps['text']}
                                </Button>
                            </Flex>
                            <Flex  {...components.components[55].renderProps}>

                                <Text {...components.components[56].renderProps}>
                                    {components.components[56].renderProps['text']}
                                </Text>
                                <Text {...components.components[57].renderProps}>
                                    {components.components[57].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[32].renderProps}>

                                <Text {...components.components[33].renderProps}>
                                    {components.components[33].renderProps['text']}
                                </Text>
                                <Text {...components.components[34].renderProps}>
                                    {components.components[34].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[35].renderProps}>

                                <Text {...components.components[36].renderProps}>
                                    {components.components[36].renderProps['text']}
                                </Text>
                                <Text {...components.components[37].renderProps}>
                                    {components.components[37].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[38].renderProps}>

                                <Text {...components.components[39].renderProps}>
                                    {components.components[39].renderProps['text']}
                                </Text>
                                <Text {...components.components[40].renderProps}>
                                    {components.components[40].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[41].renderProps}>

                                <Text {...components.components[42].renderProps}>
                                    {components.components[42].renderProps['text']}
                                </Text>
                                <Text {...components.components[43].renderProps}>
                                    {components.components[43].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[44].renderProps}>

                                <Text {...components.components[45].renderProps}>
                                    {components.components[45].renderProps['text']}
                                </Text>
                                <Text {...components.components[46].renderProps}>
                                    {components.components[46].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[47].renderProps}>

                                <Text {...components.components[48].renderProps}>
                                    {components.components[48].renderProps['text']}
                                </Text>
                                <Text {...components.components[49].renderProps}>
                                    {components.components[49].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[50].renderProps}>

                                <Text {...components.components[51].renderProps}>
                                    {components.components[51].renderProps['text']}
                                </Text>
                                <Text {...components.components[52].renderProps}>
                                    {components.components[52].renderProps['text']}
                                </Text>
                            </Flex>
                        </Flex>
                    </Grid>
                    <Grid
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        padding={"15px"}

                    >

                        <Flex  {...components.components[88].renderProps}>

                            <Flex  {...components.components[89].renderProps}>

                                <Text {...components.components[98].renderProps}>
                                    {components.components[98].renderProps['text']}
                                </Text>
                                <Button  {...components.components[99].renderProps} onClick={() => { onClick99({}) }}>
                                    {components.components[99].renderProps['text']}
                                </Button>
                            </Flex>
                            <Flex  {...components.components[90].renderProps}>

                                <Text {...components.components[100].renderProps}>
                                    {components.components[100].renderProps['text']}
                                </Text>
                                <Text {...components.components[101].renderProps}>
                                    {components.components[101].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[91].renderProps}>

                                <Text {...components.components[102].renderProps}>
                                    {components.components[102].renderProps['text']}
                                </Text>
                                <Text {...components.components[130].renderProps}>
                                    {components.components[130].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[92].renderProps}>

                                <Text {...components.components[104].renderProps}>
                                    {components.components[104].renderProps['text']}
                                </Text>
                                <Text {...components.components[105].renderProps}>
                                    {components.components[105].renderProps['text']}
                                </Text>
                            </Flex>
                            <Flex  {...components.components[94].renderProps}>

                                <Link {...components.components[131].renderProps}>
                                    {components.components[131].renderProps['text']}
                                </Link>
                                <Link {...components.components[132].renderProps}>
                                    {components.components[132].renderProps['text']}
                                </Link>
                            </Flex>
                        </Flex>
                    </Grid>
                </Grid>
            </Flex>
            <Modal
                {...components.components[117].renderProps}
                onClose={() => {
                    setComponents((old) => {
                        let new_components = {...old}
                        new_components.components[117].renderProps.isOpen = false;
                        return new_components;
                    })
                }}>
                <ModalOverlay />
                <ModalContent {...components.components[117].renderProps}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text {...components.components[118].renderProps}>
                            {components.components[118].renderProps['text']}
                        </Text>
                        <Link {...components.components[119].renderProps}>
                            {components.components[119].renderProps['text']}
                        </Link>
                        <Text {...components.components[120].renderProps}>
                            {components.components[120].renderProps['text']}
                        </Text>
                        <Button  {...components.components[121].renderProps} onClick={() => { onClick121({}) }}>
                            {components.components[121].renderProps['text']}
                        </Button></ModalBody>
                </ModalContent>
            </Modal>
            <Modal
                {...components.components[122].renderProps}
                onClose={() => {
                    setComponents((old) => {
                        let new_components = {...old}
                        new_components.components[122].renderProps.isOpen = false;
                        return new_components;
                    })
                }}>
                <ModalOverlay />
                <ModalContent {...components.components[122].renderProps}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl
                            {...components.components[123].renderProps}
                            isInvalid={components.components[123].renderProps["regex"] && components.components[123].renderProps["value"] ? !components.components[123].renderProps["value"].match(new RegExp(components.components[123].renderProps["regex"], "s")) || (components.components[123].renderProps["isRequired"] && (components.components[123].renderProps["value"] === undefined || components.components[123].renderProps["value"] === "")) : (components.components[123].renderProps["isRequired"] && (components.components[123].renderProps["value"] === undefined || components.components[123].renderProps["value"] === ""))}
                        >
                            {components.components[123].renderProps["label"] && <FormLabel>{components.components[123].renderProps["label"]}</FormLabel>}
                            <Textarea
                                placeholder={components.components[123].renderProps["placeholder"]}
                                variant={components.components[123].renderProps["variant"]}
                                size={components.components[123].renderProps["size"]}
                                value={components.components[123].renderProps["value"]}


                                type={components.components[123].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[123].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_123, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[123].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            {...components.components[124].renderProps}
                            isInvalid={components.components[124].renderProps["regex"] && components.components[124].renderProps["value"] ? !components.components[124].renderProps["value"].match(new RegExp(components.components[124].renderProps["regex"], "s")) || (components.components[124].renderProps["isRequired"] && (components.components[124].renderProps["value"] === undefined || components.components[124].renderProps["value"] === "")) : (components.components[124].renderProps["isRequired"] && (components.components[124].renderProps["value"] === undefined || components.components[124].renderProps["value"] === ""))}
                        >
                            {components.components[124].renderProps["label"] && <FormLabel>{components.components[124].renderProps["label"]}</FormLabel>}
                            <Textarea
                                placeholder={components.components[124].renderProps["placeholder"]}
                                variant={components.components[124].renderProps["variant"]}
                                size={components.components[124].renderProps["size"]}
                                value={components.components[124].renderProps["value"]}


                                type={components.components[124].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[124].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_124, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[124].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            {...components.components[125].renderProps}
                            isInvalid={components.components[125].renderProps["regex"] && components.components[125].renderProps["value"] ? !components.components[125].renderProps["value"].match(new RegExp(components.components[125].renderProps["regex"], "s")) || (components.components[125].renderProps["isRequired"] && (components.components[125].renderProps["value"] === undefined || components.components[125].renderProps["value"] === "")) : (components.components[125].renderProps["isRequired"] && (components.components[125].renderProps["value"] === undefined || components.components[125].renderProps["value"] === ""))}
                        >
                            {components.components[125].renderProps["label"] && <FormLabel>{components.components[125].renderProps["label"]}</FormLabel>}
                            <Textarea
                                placeholder={components.components[125].renderProps["placeholder"]}
                                variant={components.components[125].renderProps["variant"]}
                                size={components.components[125].renderProps["size"]}
                                value={components.components[125].renderProps["value"]}


                                type={components.components[125].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[125].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_125, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[125].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            {...components.components[127].renderProps}
                            isInvalid={components.components[127].renderProps["regex"] && components.components[127].renderProps["value"] ? !components.components[127].renderProps["value"].match(new RegExp(components.components[127].renderProps["regex"], "s")) || (components.components[127].renderProps["isRequired"] && (components.components[127].renderProps["value"] === undefined || components.components[127].renderProps["value"] === "")) : (components.components[127].renderProps["isRequired"] && (components.components[127].renderProps["value"] === undefined || components.components[127].renderProps["value"] === ""))}
                        >
                            {components.components[127].renderProps["label"] && <FormLabel>{components.components[127].renderProps["label"]}</FormLabel>}
                            <Textarea
                                placeholder={components.components[127].renderProps["placeholder"]}
                                variant={components.components[127].renderProps["variant"]}
                                size={components.components[127].renderProps["size"]}
                                value={components.components[127].renderProps["value"]}


                                type={components.components[127].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[127].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_127, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[127].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <Flex  {...components.components[129].renderProps}>

                            <Button  {...components.components[128].renderProps}>
                                {components.components[128].renderProps['text']}
                            </Button>
                        </Flex></ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}


function Page3() {
    const [components, setComponents] = useState({ components: { "0": { "type": "root", "renderProps": { "height": "100%", "backgroundColor": "#FCFCFC" }, "previewRenderProps": {} }, "1": { "type": "box", "renderProps": { "in": true, "justify": "space-between", "alignItems": "center", "backgroundColor": "#0f238c", "boxShadow": "base", "direction": "row" }, "previewRenderProps": {} }, "2": { "type": "image", "renderProps": { "src": "https://s3-symbol-logo.tradingview.com/asml--600.png", "height": "90px" }, "previewRenderProps": {} }, "3": { "type": "text", "renderProps": { "text": "cloud workloads", "fontSize": ["md", "md", "md", "md"], "color": "#ffffff" }, "previewRenderProps": {} }, "5": { "type": "box", "renderProps": { "in": true, "direction": "row", "justify": "flex-start", "alignItems": "center", "padding": "50px" }, "previewRenderProps": {} }, "6": { "type": "button", "renderProps": { "text": "Logout", "fontSize": ["md", "md", "md", "md"], "data": [{ "id": "2518037", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Logs out the user", "name": "ui_user_logout", "category": ["ui", "util"], "description": "Logs out the user and redirects to the home page", "inputs": ["main"], "img": "https://i.imgur.com/nZndvLt.png", "parameters": [], "outputs": ["main"], "version": 1, "results": [] } }], "variant": "ghost", "colorScheme": "blue" }, "previewRenderProps": {} }, "7": { "type": "box", "renderProps": { "in": true, "padding": "10px" }, "previewRenderProps": {} }, "8": { "type": "box", "renderProps": { "in": true, "alignItems": "center" }, "previewRenderProps": {} }, "9": { "type": "box", "renderProps": { "in": true, "padding": "10px", "width": "100px" }, "previewRenderProps": {} }, "10": { "type": "dataGrid", "renderProps": { "height": "600px", "width": "100%", "data": [{ "columns": [{ "field": "id", "headerName": "ID", "width": 90 }, { "field": "workload", "headerName": "Workload", "width": 150, "editable": true }, { "field": "grc", "headerName": "GRC", "width": 150, "editable": true }, { "field": "security", "headerName": "Security validation", "width": 220, "editable": true }, { "field": "risk", "headerName": "Risk go-live approval", "width": 220, "editable": true }], "rows": [{ "id": 1, "workload": "DR taipei", "grc": "yes", "security": "yes", "risk": "yes" }, { "id": 2, "workload": "DR US", "grc": "yes", "security": "no", "risk": "yes" }, { "id": 3, "workload": "ITSD", "grc": "pending", "security": "yes", "risk": "yes" }, { "id": 4, "workload": "Confluence Brion", "grc": "yes", "security": "yes", "risk": "yes" }, { "id": 5, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 6, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 7, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 8, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 9, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 10, "workload": "DR taipei", "grc": "yes", "security": "no", "risk": "no" }, { "id": 11, "workload": "DR US", "grc": "yes", "security": "no", "risk": "no" }, { "id": 12, "workload": "ITSD", "grc": "yes", "security": "no", "risk": "no" }, { "id": 13, "workload": "Confluence Brion", "grc": "yes", "security": "no", "risk": "no" }, { "id": 14, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 15, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 16, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 17, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 18, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 19, "workload": "DR taipei", "grc": "yes", "security": "no", "risk": "no" }, { "id": 20, "workload": "DR US", "grc": "yes", "security": "no", "risk": "no" }, { "id": 30, "workload": "ITSD", "grc": "yes", "security": "no", "risk": "no" }, { "id": 40, "workload": "Confluence Brion", "grc": "yes", "security": "no", "risk": "no" }, { "id": 50, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 60, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 70, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 80, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 90, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 100, "workload": "DR taipei", "grc": "yes", "security": "no", "risk": "no" }, { "id": 200, "workload": "DR US", "grc": "yes", "security": "no", "risk": "no" }, { "id": 300, "workload": "ITSD", "grc": "yes", "security": "no", "risk": "no" }, { "id": 400, "workload": "Confluence Brion", "grc": "yes", "security": "no", "risk": "no" }, { "id": 500, "workload": "HPC AKS", "grc": "yes", "security": "no", "risk": "no" }, { "id": 600, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 700, "workload": "", "grc": "yes", "security": "no", "risk": "no" }, { "id": 800, "workload": "", "grc": "no", "security": "no", "risk": "no" }, { "id": 900, "workload": "", "grc": "yes", "security": "no", "risk": "no" }] }], "density": "standard", "workflowId": 117, "_onClick": [{ "id": "5309199", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "results": [], "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Go to page", "name": "ui_page", "category": ["ui", "util"], "description": "This nodes brings the user to a different page", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Page path", "name": "id", "type": "string", "required": true, "value": "/view/" }, { "displayName": "Page param", "name": "param", "type": "string", "required": true, "value": "{{item.id}}" }], "outputs": ["main"], "version": 1 } }] }, "previewRenderProps": {} }, "11": { "type": "box", "renderProps": { "in": true, "paddingTop": "0px", "paddingLeft": "25px", "paddingRight": "25px", "paddingBottom": "25px" }, "previewRenderProps": {} }, "12": { "type": "button", "renderProps": { "text": "new cloud demand", "fontSize": ["md", "md", "md", "md"], "colorScheme": "blue", "backgroundColor": "#0f238c", "data": [{ "id": "2480055", "type": "kopplNode", "position": { "x": 600, "y": 250 }, "sourcePosition": "right", "targetPosition": "left", "style": { "height": "70px", "width": "70px", "background": "rgb(255,255,255)", "border": "1px solid #aaa", "borderRadius": "13px" }, "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "13", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }] }, "previewRenderProps": {} }, "13": { "type": "modal", "renderProps": { "isOpen": false, "size": "lg" }, "previewRenderProps": { "isOpen": false } }, "14": { "type": "input", "renderProps": { "placeholder": "workload", "value": "", "fontSize": ["md", "md", "md", "md"], "isRequired": true, "errorMessage": "The workload name cannot be empty", "variant": "flushed", "label": "Workload name", "marginTop": "20px" }, "previewRenderProps": {} }, "15": { "type": "button", "renderProps": { "text": "Create", "fontSize": ["md", "md", "md", "md"], "colorScheme": "blue", "backgroundColor": "#0f238c" }, "previewRenderProps": {} }, "16": { "type": "box", "renderProps": { "in": true, "direction": "row-reverse" }, "previewRenderProps": {} }, "17": { "type": "input", "renderProps": { "value": "", "fontSize": ["md", "md", "md", "md"], "isRequired": true, "errorMessage": "The owner name cannot be empty", "variant": "flushed", "marginTop": "20px", "label": "Owner", "placeholder": "first and last name" }, "previewRenderProps": {} }, "18": { "type": "text", "renderProps": { "text": "Create a new workload", "fontSize": ["2xl", "2xl", "2xl", "2xl"], "fontWeight": "bold" }, "previewRenderProps": {} }, "19": { "type": "box", "renderProps": { "in": true, "backgroundColor": "#7c7c7c", "height": "1px" }, "previewRenderProps": {} } } });
    const toast = useToast();
    const history = useHistory();
    const auth = useAuth();
    const { param } = useParams()

    const onClick6 = (data) => {
        let executionInstructions = [{ "id": "2518037", "data": { "displayName": "Logs out the user", "name": "ui_user_logout", "category": ["ui", "util"], "description": "Logs out the user and redirects to the home page", "inputs": ["main"], "img": "https://i.imgur.com/nZndvLt.png", "parameters": [], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    const onClick12 = (data) => {
        let executionInstructions = [{ "id": "2480055", "data": { "displayName": "Change component", "name": "ui_change", "category": ["ui", "util"], "description": "This nodes sets UI components' properties", "inputs": ["main"], "img": "https://i.imgur.com/o9QYU9V.png", "parameters": [{ "displayName": "Components", "name": "components", "type": "array", "value": [{ "id": "13", "property": "isOpen", "value": "{{ true }}" }], "parameters": [{ "displayName": "Component id", "name": "id", "type": "component", "required": true }, { "displayName": "Property name", "name": "property", "type": "string", "options": ["value", "label", "data", "text", "width", "height", "hidden", "color", "backgroundColor", "isOpen", "rounding", "shadow", "maxWidth", "maxHeight", "minWidth", "minHeight", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom", "padding", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom"], "required": true }, { "displayName": "Property value", "name": "value", "type": "string", "required": false }] }], "outputs": ["main"], "version": 1, "results": [] } }];
        execute(data, executionInstructions, setComponents, toast, history, components)
    }

    React.useEffect(() => {
    }, []);

    return (

        <Box  {...components.components[0].renderProps}>

            <Flex  {...components.components[1].renderProps}>

                <Flex  {...components.components[9].renderProps}>

                </Flex>
                <Flex  {...components.components[8].renderProps}>

                    <Image {...components.components[2].renderProps}>
                    </Image>
                    <Text {...components.components[3].renderProps}>
                        {components.components[3].renderProps['text']}
                    </Text>
                </Flex>
                <Flex  {...components.components[7].renderProps}>

                    <Button  {...components.components[6].renderProps} onClick={() => { onClick6({}) }}>
                        {components.components[6].renderProps['text']}
                    </Button>
                </Flex>
            </Flex>
            <Flex  {...components.components[5].renderProps}>

                <Button  {...components.components[12].renderProps} onClick={() => { onClick12({}) }}>
                    {components.components[12].renderProps['text']}
                </Button>
            </Flex>
            <Flex  {...components.components[11].renderProps}>

            </Flex>
            <Modal
                {...components.components[13].renderProps}
                onClose={() => {
                    setComponents((old) => {
                        let new_components = {...old}
                        new_components.components[13].renderProps.isOpen = false;
                        return new_components;
                    })
                }}>
                <ModalOverlay />
                <ModalContent {...components.components[13].renderProps}>
                    <ModalHeader></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text {...components.components[18].renderProps}>
                            {components.components[18].renderProps['text']}
                        </Text>
                        <Flex  {...components.components[19].renderProps}>

                        </Flex>
                        <FormControl
                            {...components.components[14].renderProps}
                            isInvalid={components.components[14].renderProps["regex"] && components.components[14].renderProps["value"] ? !components.components[14].renderProps["value"].match(new RegExp(components.components[14].renderProps["regex"], "s")) || (components.components[14].renderProps["isRequired"] && (components.components[14].renderProps["value"] === undefined || components.components[14].renderProps["value"] === "")) : (components.components[14].renderProps["isRequired"] && (components.components[14].renderProps["value"] === undefined || components.components[14].renderProps["value"] === ""))}
                        >
                            {components.components[14].renderProps["label"] && <FormLabel>{components.components[14].renderProps["label"]}</FormLabel>}
                            <Input
                                placeholder={components.components[14].renderProps["placeholder"]}
                                variant={components.components[14].renderProps["variant"]}
                                size={components.components[14].renderProps["size"]}
                                value={components.components[14].renderProps["value"]}


                                type={components.components[14].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[14].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_14, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[14].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <FormControl
                            {...components.components[17].renderProps}
                            isInvalid={components.components[17].renderProps["regex"] && components.components[17].renderProps["value"] ? !components.components[17].renderProps["value"].match(new RegExp(components.components[17].renderProps["regex"], "s")) || (components.components[17].renderProps["isRequired"] && (components.components[17].renderProps["value"] === undefined || components.components[17].renderProps["value"] === "")) : (components.components[17].renderProps["isRequired"] && (components.components[17].renderProps["value"] === undefined || components.components[17].renderProps["value"] === ""))}
                        >
                            {components.components[17].renderProps["label"] && <FormLabel>{components.components[17].renderProps["label"]}</FormLabel>}
                            <Input
                                placeholder={components.components[17].renderProps["placeholder"]}
                                variant={components.components[17].renderProps["variant"]}
                                size={components.components[17].renderProps["size"]}
                                value={components.components[17].renderProps["value"]}


                                type={components.components[17].renderProps["isPassword"] ? "password" : "text"}
                                onChange={(e) => {
                                    setComponents((old) => { old.components[17].renderProps["value"] = e.target.value; return { ...old }; });
                                    execute([{}], onChange_17, setComponents, toast, history, components);
                                }}
                            />
                            <FormErrorMessage>{components.components[17].renderProps["errorMessage"]}</FormErrorMessage>
                        </FormControl>
                        <Flex  {...components.components[16].renderProps}>

                            <Button  {...components.components[15].renderProps}>
                                {components.components[15].renderProps['text']}
                            </Button>
                        </Flex></ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}


function Page4() {
    const [components, setComponents] = useState({ components: { "0": { "type": "root", "renderProps": { "height": "100%" } } } });
    const toast = useToast();
    const history = useHistory();
    const auth = useAuth();
    const { param } = useParams()

    React.useEffect(() => {
    }, []);

    return (
        <Box  {...components.components[0].renderProps}></Box>
    );
}

export default App;
