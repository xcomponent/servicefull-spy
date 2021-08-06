import { Grommet } from "grommet";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { RootReducer } from "./reducers/spyReducer";
import { getLocalizedResources } from "./locales/localeConfiguration";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { routes } from "./utils/routes";
// import XCSpyMainPage from "./components/XCSpyMainPage";
import XCSpyApp from "./components/XCSpyApp";
import Configuration from "./components/Configuration";

const middleware = applyMiddleware(thunk, logger);
const store = createStore(RootReducer, middleware);

const customTheme = {
  global: {
    colors: {
      // Overriding existing colors
      brand: "#A61B1B",
      // "accent-1": "#6FFFB0",
      // "accent-2": "#7FFFB0",
      // "accent-3": "#8FFFB0",
      // "accent-4": "#9FFFB0",
      // "neutral-1": "#10873D",
      // "neutral-2": "#20873D",
      // "neutral-3": "#30873D",
      // "neutral-4": "#40873D",
      // focus: "#000",
      // // Setting new colors
      // blue: "#00C8FF",
      // green: "#17EBA0",
      // teal: "#82FFF2",
      // purple: "#F740FF",
      // red: "#FC6161",
      // orange: "#FFBC44",
      // yellow: "#FFEB59",
      // // you can also point to existing grommet colors
      // brightGreen: "accent-1",
      // deepGreen: "neutral-2",
      // // Changing default text color,
      // // all colors could be either a string or a dark and light object
      // text: {
      //   dark: "teal",
      //   light: "purple",
      // },
    },
  },
};

interface AppProps {
  lang: string;
  isFullSizeMenu: boolean;
}

function App({ lang, isFullSizeMenu }: AppProps) {
  return (
    <Grommet
      plain
      full="min"
      theme={customTheme}
      style={{ height: "100%", minHeight: "100%" }}
    >
      <Provider store={store}>
        <IntlProvider
          locale={lang}
          messages={getLocalizedResources(lang).messages}
        >
          <BrowserRouter>
            <Switch>
              <Route
                exact={true}
                path={routes.paths.home}
                component={Configuration}
              />
              <Route
                path={routes.paths.app}
                render={(props) => (
                  <XCSpyApp isFullSizeMenu={isFullSizeMenu} {...props} />
                )}
              />
            </Switch>
          </BrowserRouter>
        </IntlProvider>
      </Provider>
    </Grommet>
  );
}

export default App;
