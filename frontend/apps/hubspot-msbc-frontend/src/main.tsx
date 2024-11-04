import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "driver.js/dist/driver.css";

import TagManager from "react-gtm-module";
import { Provider } from "react-redux";
import store from "./store/index.ts";

const tagManagerArgs = {
  gtmId: "GTM-KRMPWK2",
};

TagManager.initialize(tagManagerArgs);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
