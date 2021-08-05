import React from "react";
import ReactDOM from "react-dom";
import AppWithBanner from "./AppWithBanner";
import reportWebVitals from "./reportWebVitals";
import { loadConfig } from "./settings";
import "./index.css";
import "x4b-ui/dist/x4b-ui/x4b-ui.css";
import "./register-x4b-banner";

const history = require("history").createBrowserHistory();

const Index = () => {
  const [configLoaded, setConfigLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadConfig()
      .then(() => setConfigLoaded(true))
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }, []);

  if (!configLoaded) {
    return <div />;
  }

  return (
    <React.StrictMode>
      <AppWithBanner history={history} />
    </React.StrictMode>
  );
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
ReactDOM.render(<Index />, document.getElementById("root") as HTMLElement);
