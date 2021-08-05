import { connect } from "react-redux";
import * as React from "react";
import { setCompositionModel } from "../actions/compositionModel";
import { Redirect } from "react-router-dom";
import { routes } from "../utils/routes";
import { XCSpyState } from "../reducers/spyReducer";
import { initSession } from "../actions/session";
import { setServerUrl } from "../actions/configForm";
import { CompositionModelState } from "../reducers/compositionModel";
import ConfigForm from "./ConfigForm";

interface XCSpyGlobalProps extends XCSpyProps, XCSpyCallbackProps {}

interface XCSpyProps {
  submitted: boolean;
  selectedApi: string;
  serverUrl: string;
  serverUrlParams: string | null;
  compositionModel: CompositionModelState;
}

interface XCSpyCallbackProps {
  setCompositionModel: (xcApiName: string, serverUrl: string) => void;
  initSession: (xcApiName: string, serverUrl: string) => void;
  onSetServerUrl: (serverUrl: string) => void;
}

class XCSpyMainPage extends React.Component<XCSpyGlobalProps, XCSpyState> {
  componentDidMount() {
    if (this.props.serverUrlParams) {
      this.props.onSetServerUrl(this.props.serverUrlParams);
    }
  }

  componentDidUpdate() {
    const props = this.props;
    if (props.submitted && !props.compositionModel.initialized) {
      props.setCompositionModel(props.selectedApi, props.serverUrl);
    }
    if (props.compositionModel.initialized) {
      props.initSession(props.selectedApi, props.serverUrl);
    }
  }
  render() {
    const props = this.props;
    if (
      !props.submitted ||
      (props.submitted && !props.compositionModel.initialized)
    ) {
      return <ConfigForm />;
    }
    const currentComponent = props.compositionModel.value!.components[0].name;
    return (
      <Redirect
        to={{
          pathname: routes.paths.app,
          search: `${routes.params.serverUrl}=${props.serverUrl}&${routes.params.api}=${props.selectedApi}&${routes.params.currentComponent}=${currentComponent}`,
        }}
      />
    );
  }
}

const mapStateToProps = (state: XCSpyState, ownProps: any): XCSpyProps => {
  const urlSearchParams = new URLSearchParams(ownProps.location.search);
  const serverUrlParams = urlSearchParams.get(routes.params.serverUrl);
  return {
    submitted: state.configForm.formSubmited,
    selectedApi: state.configForm.selectedApi!,
    serverUrl: state.configForm.serverUrl!,
    serverUrlParams: serverUrlParams,
    compositionModel: state.compositionModel,
  };
};

const mapDispatchToProps = (dispatch: any): XCSpyCallbackProps => {
  return {
    setCompositionModel: (xcApiName: string, serverUrl: string) => {
      dispatch(setCompositionModel(xcApiName, serverUrl));
    },
    initSession: (xcApiName: string, serverUrl: string): void => {
      dispatch(initSession(xcApiName, serverUrl));
    },
    onSetServerUrl: (serverUrl: string) => {
      dispatch(setServerUrl(serverUrl));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(XCSpyMainPage);
