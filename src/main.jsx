import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import SuspenseContent from "./containers/SuspenseContent.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>

  <Provider store={store}>
    <App />
  </Provider>
);
