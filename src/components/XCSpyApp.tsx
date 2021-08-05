import { connect } from "react-redux";
import * as React from "react";
import { routes } from "../utils/routes";
import { XCSpyState } from "../reducers/spyReducer";
import { Box, Button, Grid, Header, Layer, Main, Text } from "grommet";
import SpySideBar from "./SpySideBar";
import Components from "./Components";
import StateMachineProperties from "./StateMachineProperties";
import TransitionProperties from "./TransitionProperties";
import { setCompositionModel } from "../actions/compositionModel";
import { initSession } from "../actions/session";
import AppHeader from "./AppHeader";

interface XCSpyAppGlobalProps extends XCSpyAppProps, XCSpyAppCallbackProps {}

interface XCSpyAppProps {
  initialized: boolean;
  api: string;
  serverUrl: string;
  currentComponent: string;
}

interface XCSpyAppCallbackProps {
  setCompositionModel: (xcApiName: string, serverUrl: string) => void;
  initSession: (xcApiName: string, serverUrl: string) => void;
}

class XCSpyApp extends React.Component<XCSpyAppGlobalProps, XCSpyState> {
  componentWillMount() {
    if (!this.props.initialized) {
      const serverUrl = this.props.serverUrl;
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
      <Box direction={"row"} fill margin="auto" width={{ max: "xxlarge" }}>
        <SpySideBar />
        <Box flex overflow="auto">
          <Box height={{ min: "100%" }}>
            <Header
              background="background-front"
              fill="horizontal"
              pad="small"
              border={{ color: "border", style: "dashed" }}
              height="xxsmall"
            >
              <AppHeader />
            </Header>
            <Main
              fill={undefined}
              flex={false}
              pad="small"
              border={{ color: "border", style: "dashed" }}
              height="xlarge"
            >
              <Box fill={true} direction="column">
                <Components />
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
    serverUrl: values[routes.params.serverUrl],
    currentComponent: values[routes.params.currentComponent],
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
