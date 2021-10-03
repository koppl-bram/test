const regeneratorRuntime = require("regenerator-runtime");
import 'core-js/features/object';
import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";
import App from "./app";


ReactDOM.render(
    <App />,
    document.getElementById('app')
);

module.hot.accept();
