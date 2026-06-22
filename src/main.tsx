import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './i18.js';
import {store} from "./store/store.ts";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>

    </React.StrictMode>
);