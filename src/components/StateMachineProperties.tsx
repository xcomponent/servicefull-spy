import * as React from "react";
import { connect } from "react-redux";
import Instances from "./Instances";
import { XCSpyState } from "../reducers/spyReducer";
import { Instance } from "../reducers/components";
import { withRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { StateMachineRef } from "reactivexcomponent.js";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { clearFinalStates } from "../actions/components";
import { Form, Box, Button, FormField, Footer, Layer, Text } from "grommet";
import {
  setStateMachineId,
  hideStateMachineProperties,
  snapshotAction,
} from "../actions/stateMachineProperties";
import { Close } from "grommet-icons";

interface StateMachinePropertiesGlobalProps
  extends StateMachinePropertiesProps,
    StateMachinePropertiesCallbackProps {}

interface StateMachinePropertiesProps extends WrappedComponentProps {
  active: boolean;
  stateMachine: string;
  id: string;
  currentComponent: string;
  ids: string[];
  instances: { [id: number]: Instance };
  publicMember: string | null;
  stateMachineRef: StateMachineRef | null;
}

interface StateMachinePropertiesCallbackProps {
  clearFinalStates: (component: string, stateMachine: string) => void;
  setStateMachineId: (id: string) => void;
  hideStateMachineProperties: () => void;
  snapshot: (currentComponent: string, stateMachine: string) => void;
}

const mapStateToProps = (
  state: XCSpyState,
  ownProps: any
): StateMachinePropertiesProps => {
  const urlSearchParams = new URLSearchParams(ownProps.location.search);
  const id = state.stateMachineProperties.id!;
  const active = state.stateMachineProperties.active;
  const componentProperties = state.components.componentProperties;
  const currentComponent = urlSearchParams.get(routes.params.component)!;
  const stateMachine = state.stateMachineProperties.stateMachine!;
  const instances = !active
    ? {}
    : componentProperties[currentComponent].stateMachineProperties[
        stateMachine
      ];
  const ids = instances !== null ? Object.keys(instances) : [];
  const stateMachineRef = !id
    ? null
    : componentProperties[currentComponent].stateMachineProperties[
        stateMachine
      ][parseInt(id)].stateMachineRef;
  const publicMember = !id
    ? null
    : JSON.stringify(instances[parseInt(id)].jsonMessage);
  return {
    active,
    stateMachine,
    id,
    currentComponent,
    ids: ids,
    instances,
    publicMember,
    stateMachineRef,
    intl: ownProps.intl,
  };
};

const mapDispatchToProps = (
  dispatch: any
): StateMachinePropertiesCallbackProps => {
  return {
    clearFinalStates: (component: string, stateMachine: string): void => {
      dispatch(clearFinalStates(component, stateMachine));
    },
    setStateMachineId: (id: string): void => {
      dispatch(setStateMachineId(id));
    },
    hideStateMachineProperties: (): void => {
      dispatch(hideStateMachineProperties());
    },
    snapshot: (currentComponent: string, stateMachine: string): void => {
      dispatch(snapshotAction(currentComponent, stateMachine));
    },
  };
};

class StateMachineProperties extends React.Component<
  StateMachinePropertiesGlobalProps,
  XCSpyState
> {
  componentWillMount() {
    if (this.props.active && !this.props.id && this.props.ids.length > 0) {
      setStateMachineId(this.props.ids[0]);
    }
  }

  render() {
    if (!this.props.active) return null;
    return (
      // <Layer align="right" onClose={this.props.hideStateMachineProperties}>
      <Layer>
        <Form>
          <Box direction="row" align="center" justify="center">
            <Box align="start" justify="center" basis="1/2">
              <Text>{this.props.stateMachine}</Text>
            </Box>
            <Box align="end" justify="center" basis="1/2">
              <Button
                title={"Close"}
                icon={<Close size="medium" />}
                onClick={this.props.hideStateMachineProperties}
              />
            </Box>
          </Box>

          <FormField>
            <fieldset>
              <label htmlFor="instances">
                {this.props.intl.formatMessage({
                  id: "app.instance.identifier",
                })}{" "}
                :
                <Instances
                  onChange={this.props.setStateMachineId}
                  stateMachine={this.props.stateMachine}
                  instances={this.props.instances}
                />
              </label>
            </fieldset>
          </FormField>

          <FormField>
            <fieldset>
              <label htmlFor="publicMember">
                {this.props.intl.formatMessage({ id: "app.public.member" })} :{" "}
                <br />
                {this.props.publicMember}
              </label>
            </fieldset>
          </FormField>

          <FormField>
            <fieldset>
              <label htmlFor="currentState">
                {this.props.intl.formatMessage({ id: "app.current.state" })} :{" "}
                {this.props.stateMachineRef
                  ? this.props.stateMachineRef.StateName
                  : null}
              </label>
            </fieldset>
          </FormField>

          <FormField>
            <fieldset>
              <label htmlFor="workerId">
                {this.props.intl.formatMessage({ id: "app.worker.id" })} :{" "}
                {this.props.stateMachineRef
                  ? this.props.stateMachineRef.WorkerId
                  : null}
              </label>
            </fieldset>
          </FormField>

          <FormField>
            <fieldset>
              <label htmlFor="Error Message">
                {this.props.intl.formatMessage({ id: "app.error.message" })} :{" "}
                {this.props.stateMachineRef
                  ? this.props.stateMachineRef.ErrorMessage
                  : null}
              </label>
            </fieldset>
          </FormField>

          <Footer></Footer>
          <Button
            primary={true}
            type="button"
            label={this.props.intl.formatMessage({ id: "app.snapshot" })}
            onClick={() => {
              this.props.snapshot(
                this.props.currentComponent,
                this.props.stateMachine
              );
              this.props.hideStateMachineProperties();
            }}
          />
          <Button
            primary={true}
            type="button"
            label={this.props.intl.formatMessage({ id: "app.clear" })}
            onClick={() => {
              this.props.clearFinalStates(
                this.props.currentComponent,
                this.props.stateMachine
              );
              this.props.hideStateMachineProperties();
            }}
          />
        </Form>
      </Layer>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(injectIntl(StateMachineProperties))
);
