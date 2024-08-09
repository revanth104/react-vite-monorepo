import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";

import "bootstrap/dist/css/bootstrap.min.css";

import TagManager from "react-gtm-module";

import { Provider } from "react-redux";
import store from "./store/index.ts";

const tagManagerArgs = {
  gtmId: "GTM-KRMPWK2",
};

TagManager.initialize(tagManagerArgs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
