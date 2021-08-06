import { connect } from "react-redux";
import { XCSpyState } from "../reducers/spyReducer";
import { routes } from "../utils/routes";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { Menu, Anchor, CheckBox, Box, Button, Text } from "grommet";
import { clearFinalStates, setAutoClear } from "../actions/components";
import { logout } from "../actions/session";
import { snapshotAllAction } from "../actions/stateMachineProperties";
import { Home } from "grommet-icons/icons";

interface AppHeaderGlobalProps extends AppHeaderProps, AppHeaderCallbackProps {}

interface AppHeaderProps extends WrappedComponentProps {
  currentComponent: string;
  getStateMachines: (component: string) => string[];
  components: string[];
  autoClear: boolean;
}

interface AppHeaderCallbackProps {
  returnHome: () => void;
  clearFinalStates: (component: string, stateMachines: string[]) => void;
  snapshotAll: (component: string, stateMachines: string[]) => void;
  setAutoClear: (autoClear: boolean) => void;
}

const mapStateToProps = (state: XCSpyState, ownProps: any): AppHeaderProps => {
  const initialized = state.components.initialized;
  const componentProperties = state.components.componentProperties;
  const components = !initialized ? [] : Object.keys(componentProperties);
  //   const urlSearchParams = new URLSearchParams(ownProps.location.search);
  //   const currentComponent = urlSearchParams.get(routes.params.currentComponent)!;
  const currentComponent = "TestComponent";
  return {
    intl: ownProps.intl,
    currentComponent,
    getStateMachines: (component: string): string[] => {
      if (!initialized) return [];
      return Object.keys(componentProperties[component].stateMachineProperties);
    },
    components: components,
    autoClear: state.components.autoClear,
  };
};

const mapDispatchToProps = (
  dispatch: any,
  ownProps: any
): AppHeaderCallbackProps => {
  return {
    returnHome: (): void => {
      dispatch(logout());
      ownProps.history.push(routes.paths.home);
    },
    clearFinalStates: (component: string, stateMachines: string[]): void => {
      for (let i = 0; i < stateMachines.length; i++) {
        dispatch(clearFinalStates(component, stateMachines[i]));
      }
    },
    snapshotAll: (component: string, stateMachines: string[]): void => {
      dispatch(snapshotAllAction(component, stateMachines));
    },
    setAutoClear: (autoClear: boolean): void => {
      dispatch(setAutoClear(autoClear));
    },
  };
};

const AppHeader = ({
  intl,
  returnHome,
  getStateMachines,
  currentComponent,
  snapshotAll,
  clearFinalStates,
  autoClear,
  setAutoClear,
  components,
}: AppHeaderGlobalProps) => {
  const menuSpy = (
    <Menu
      primary={true}
      title={intl.formatMessage({ id: "app.menu" })}
      icon={<Home size="medium" />}
      items={[]}
    >
      <Anchor
        onClick={() => {
          snapshotAll(currentComponent, getStateMachines(currentComponent));
        }}
      >
        {intl.formatMessage({ id: "app.snapshot.all" })}
      </Anchor>
      <Anchor
        onClick={() => {
          clearFinalStates(
            currentComponent,
            getStateMachines(currentComponent)
          );
        }}
      >
        {intl.formatMessage({ id: "app.clear.all" })}
      </Anchor>

      <Anchor>
        {
          <CheckBox
            label={intl.formatMessage({ id: "app.auto.clear" })}
            toggle={true}
            checked={autoClear}
            onChange={() => {
              for (let i = 0; i < components.length; i++) {
                clearFinalStates(
                  components[i],
                  getStateMachines(components[i])
                );
              }
              setAutoClear(!autoClear);
            }}
          />
        }
      </Anchor>
    </Menu>
  );
  return (
    <Box direction="row">
      <Box justify="center" basis="1/3">
        {menuSpy}
      </Box>
      <Box align="center" justify="center" basis="1/3">
        <Text>{intl.formatMessage({ id: "app.title" })}</Text>
      </Box>
      <Box align="end" justify="center" basis="1/3">
        <Button
          title={intl.formatMessage({ id: "app.home" })}
          icon={<Home size="medium" />}
          onClick={returnHome}
        />
      </Box>
    </Box>
  );
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(AppHeader)
);
