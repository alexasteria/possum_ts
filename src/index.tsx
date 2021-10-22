import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import bridge from "@vkontakte/vk-bridge";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { reducer } from "./store/reducer";
const store = createStore(reducer);

// Init VK  Mini App
bridge.send("VKWebAppInit");
let linkParams = window.location.hash
    .replace("#", "")
    .split("&")
    .reduce(function (p:any, e) {
        let a = e.split("=");
        p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
        return p;
    }, {});
let params = window.location.search
    .replace("?", "")
    .split("&")
    .reduce(function (p:any, e) {
        let a = e.split("=");
        p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
        return p;
    }, {});

ReactDOM.render(
    <Provider store={store}>
  <React.StrictMode>
    <App linkParams={linkParams} params={params}/>
  </React.StrictMode>
    </Provider>,
  document.getElementById('root')
);