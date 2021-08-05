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
import XCSpyMainPage from "./components/XCSpyMainPage";
import XCSpyApp from "./components/XCSpyApp";

const middleware = applyMiddleware(thunk, logger);
const store = createStore(RootReducer, middleware);

function App({ lang }: { lang: string }) {
  return (
    <Grommet plain>
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
                component={XCSpyMainPage}
              />
              <Route path={routes.paths.form} component={XCSpyMainPage} />
              <Route path={routes.paths.app} component={XCSpyApp} />
            </Switch>
          </BrowserRouter>
        </IntlProvider>
      </Provider>
    </Grommet>
  );
}

export default App;
