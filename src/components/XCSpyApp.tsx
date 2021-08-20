import { connect } from "react-redux";
import * as React from "react";
import { routes } from "../utils/routes";
import { XCSpyState } from "../reducers/spyReducer";
import { Box, Header, Main, Sidebar } from "grommet";
import Components from "./Components";
import StateMachineProperties from "./StateMachineProperties";
import TransitionProperties from "./TransitionProperties";
import { setCompositionModel } from "../actions/compositionModel";
import { initSession } from "../actions/session";
import AppHeader from "./AppHeader";
import { buildUrl } from "./Configuration";

interface XCSpyAppGlobalProps extends XCSpyAppProps, XCSpyAppCallbackProps {
  isFullSizeMenu: boolean;
}

interface XCSpyAppProps {
  initialized: boolean;
  api: string;
  host: string;
  port: number;
  secure: boolean;
  currentComponent: string;
}

interface XCSpyAppCallbackProps {
  setCompositionModel: (xcApiName: string, serverUrl: string) => void;
  initSession: (xcApiName: string, serverUrl: string) => void;
}

class XCSpyApp extends React.Component<XCSpyAppGlobalProps, XCSpyState> {
  componentWillMount() {
    if (!this.props.initialized) {
      const serverUrl = buildUrl(
        this.props.host,
        this.props.port,
        this.props.secure
      );
      const api = this.props.api;
      this.props.initSession(api, serverUrl);
      this.props.setCompositionModel(api, serverUrl);
    }
  }

  render() {
    if (!this.props.initialized) {
      return <div>Loading...</div>;
    }

    // return (
    //   <Grid fill margin="auto" width={{ max: "xxlarge" }}>
    //     <Box justify="center" align="center">
    //       <Layer position="left" full="vertical" modal={false} plain={true}>
    //         <Box background="brand" fill="vertical">
    //           <Box pad={{ horizontal: "medium", vertical: "small" }}>
    //             <Text size="large">Title</Text>
    //           </Box>
    //           {["First", "Second", "Third"].map((name) => (
    //             <Button key={name}>
    //               <Box pad={{ horizontal: "medium", vertical: "small" }}>
    //                 <Text size="large">{name}</Text>
    //               </Box>
    //             </Button>
    //           ))}
    //         </Box>
    //       </Layer>
    //     </Box>
    //     <Components />
    //   </Grid>
    // );

    return (
      <Box direction={"row"} fill margin="auto">
        {this.props.isFullSizeMenu && (
          <Sidebar
            flex={false}
            height={{ min: "100%" }}
            pad="small"
            gap="large"
            background="brand"
            border={{ color: "border", style: "solid" }}
            style={{ width: 240 }}
          >
            {"Components"}
            {/* <Nav gap="small">{this.getComponentList()}</Nav> */}
          </Sidebar>
        )}
        <Box flex overflow="auto" height="100%">
          <Main fill={undefined} flex={false} height="100%">
            <Header
              background="background-front"
              fill="horizontal"
              height="xxsmall"
            >
              <AppHeader />
            </Header>
            <Box fill={true} direction="column">
              {/* <Components /> */}
              <Box>
                <StateMachineProperties />
              </Box>
              <Box>
                <TransitionProperties />
              </Box>
            </Box>
          </Main>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state: XCSpyState, ownProps: any): XCSpyAppProps => {
  const values: { [key: string]: any } = {};
  ownProps.location.search
    .replace("?", "")
    .split("&")
    .forEach((element: any) => {
      const s = element.split("=");
      values[s[0]] = s[1];
    });
  return {
    initialized: state.compositionModel.initialized,
    api: values[routes.params.api],
    host: values[routes.params.host],
    port: parseInt(values[routes.params.port]),
    secure: values[routes.params.secure] === "true",
    currentComponent: values[routes.params.component],
  };
};

const mapDispatchToProps = (dispatch: any): XCSpyAppCallbackProps => {
  return {
    setCompositionModel: (xcApiName: string, serverUrl: string): void => {
      dispatch(setCompositionModel(xcApiName, serverUrl));
    },
    initSession: (xcApiName: string, serverUrl: string): void => {
      dispatch(initSession(xcApiName, serverUrl));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(XCSpyApp);
