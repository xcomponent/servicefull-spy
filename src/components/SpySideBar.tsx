import * as React from "react";
import { connect } from "react-redux";
import { XCSpyState } from "../reducers/spyReducer";
import { Dispatch } from "redux";
import { Link, withRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { Action } from "redux";
import { Box, Button, Menu, Nav, Sidebar, Text } from "grommet";
import { Close } from "grommet-icons";
import { hideSideBar } from "../actions/sideBar";

interface SideBarGlobalProps extends SideBarProps, SideBarCallbackProps {}

interface SideBarProps {
  isVisible: boolean;
  initialized: boolean;
  components: string[];
  currentComponent: string | null;
  projectName: string;
  serverUrl: string | null;
  api: string | null;
}

interface SideBarCallbackProps {
  hideSideBar: () => void;
}

const mapStateToProps = (state: XCSpyState, ownProps: any): SideBarProps => {
  const urlSearchParams = new URLSearchParams(ownProps.location.search);
  const currentComponent = urlSearchParams.get(routes.params.currentComponent);
  const serverUrl = urlSearchParams.get(routes.params.serverUrl);
  const api = urlSearchParams.get(routes.params.api);
  return {
    isVisible: state.sideBar.isVisible,
    initialized: state.components.initialized,
    components: Object.keys(state.components.componentProperties),
    currentComponent,
    projectName: state.components.projectName!,
    serverUrl,
    api,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<Action>
): SideBarCallbackProps => {
  return {
    hideSideBar: () => {
      dispatch(hideSideBar());
    },
  };
};

class SpySideBar extends React.Component<SideBarGlobalProps, XCSpyState> {
  constructor(props: SideBarGlobalProps) {
    super(props);
    this.getTitle = this.getTitle.bind(this);
    this.getComponentList = this.getComponentList.bind(this);
  }

  getTitle() {
    return (
      <Box direction="row">
        <Box pad="medium" justify="between">
          <Text>{this.props.projectName}</Text>
        </Box>
      </Box>
    );
  }

  getComponentList() {
    const props = this.props;
    const components = props.components;
    return components.map((component: string) => {
      return (
        <Button
          key={component}
          href={`${routes.paths.app}/${routes.params.serverUrl}=${props.serverUrl}&${routes.params.api}=${props.api}&${routes.params.currentComponent}=${component}`}
          className={props.currentComponent === component ? "active" : ""}
        >
          {component}
        </Button>
      );
    });
  }

  render() {
    if (!this.props.initialized || !this.props.isVisible) return null;
    return (
      <Sidebar
        direction={"row"}
        flex={false}
        height={{ min: "100%" }}
        pad="small"
        background="brand"
        border={{ color: "border", style: "dashed" }}
      >
        {this.getTitle()}
        <Nav gap="small">{this.getComponentList()}</Nav>
      </Sidebar>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SpySideBar)
);
