import { connect } from "react-redux";
import { XCSpyState } from "../reducers/spyReducer";
import { Dispatch } from "redux";
import { Instance } from "../reducers/components";
import { withRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { StateMachineRef } from "reactivexcomponent.js";
import { Action } from "redux";
import {
  Box,
  Button,
  Footer,
  Form,
  FormField,
  Layer,
  TextInput,
  Text,
} from "grommet";
import { Close } from "grommet-icons";
import Instances from "./Instances";
import {
  hideTransitionProperties,
  send,
  sendContext,
  setCurrentId,
  setJsonMessageString,
  setPrivateTopic,
} from "../actions/transitionProperties";

interface TransitionPropertiesGlobalProps
  extends TransitionPropertiesProps,
    TransitionPropertiesCallbackProps {}

interface TransitionPropertiesProps extends WrappedComponentProps {
  privateTopics: string[];
  privateTopic: string | undefined;
  id: string | undefined;
  jsonMessageString: string | undefined;
  messageType: string | undefined;
  active: boolean;
  stateMachine: string;
  currentComponent: string | null;
  stateMachineRef: StateMachineRef | null;
  instances: { [id: number]: Instance };
}

interface TransitionPropertiesCallbackProps {
  setPrivateTopic: (privateSend: string) => void;
  setCurrentId: (id: string) => void;
  setJsonMessageString: (jsonMessageString: string) => void;
  hideTransitionProperties: () => void;
  send: (
    component: string,
    stateMachine: string,
    messageType: string,
    jsonMessageString: string,
    privateTopic: string
  ) => void;
  sendContext: (
    stateMachineRef: StateMachineRef,
    messageType: string,
    jsonMessageString: string,
    privateTopic: string
  ) => void;
}

const mapStateToProps = (
  state: XCSpyState,
  ownProps: any
): TransitionPropertiesProps => {
  const urlSearchParams = new URLSearchParams(ownProps.location.search);
  const active = state.transitionProperties.active;
  const id = state.transitionProperties.id;
  const componentProperties = state.components.componentProperties;
  const currentComponent = urlSearchParams.get(routes.params.currentComponent);
  const stateMachine = state.transitionProperties.stateMachine!;
  const instances = !active
    ? {}
    : componentProperties[currentComponent!].stateMachineProperties[
        stateMachine
      ];
  const privateTopic = state.transitionProperties.defaultPrivateTopic;
  const privateTopics = state.transitionProperties.privateTopics;
  const jsonMessageString = state.transitionProperties.jsonMessageString;
  const messageType = state.transitionProperties.messageType;
  const stateMachineRef =
    !id ||
    !active ||
    componentProperties[currentComponent!].stateMachineProperties[stateMachine][
      parseInt(id)
    ].isFinal
      ? null
      : componentProperties[currentComponent!].stateMachineProperties[
          stateMachine
        ][parseInt(id)].stateMachineRef;
  return {
    instances,
    privateTopic,
    privateTopics,
    id,
    jsonMessageString,
    messageType,
    active,
    stateMachine,
    currentComponent,
    stateMachineRef,
    intl: ownProps.intl,
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch<Action>
): TransitionPropertiesCallbackProps => {
  return {
    setPrivateTopic: (privateSend: string): void => {
      dispatch(setPrivateTopic(privateSend));
    },
    setCurrentId: (id: string): void => {
      dispatch(setCurrentId(id));
    },
    setJsonMessageString: (jsonMessageString: string): void => {
      dispatch(setJsonMessageString(jsonMessageString));
    },
    hideTransitionProperties: (): void => {
      dispatch(hideTransitionProperties());
    },
    send: (
      component: string,
      stateMachine: string,
      messageType: string,
      jsonMessageString: string,
      privateTopic: string
    ): void => {
      dispatch(
        send(
          component,
          stateMachine,
          messageType,
          jsonMessageString,
          privateTopic
        )
      );
    },
    sendContext: (
      stateMachineRef: StateMachineRef,
      messageType: string,
      jsonMessageString: string,
      privateTopic: string
    ): void => {
      dispatch(
        sendContext(
          stateMachineRef,
          messageType,
          jsonMessageString,
          privateTopic
        )
      );
    },
  };
};

const TransitionProperties = ({
  intl,
  messageType,
  active,
  hideTransitionProperties,
  stateMachine,
  currentComponent,
  jsonMessageString,
  setJsonMessageString,
  id,
  setCurrentId,
  stateMachineRef,
  privateTopic,
  privateTopics,
  setPrivateTopic,
  send,
  sendContext,
  instances,
}: TransitionPropertiesGlobalProps) => {
  if (!active) return null;
  return (
    // <Layer onClose={hideTransitionProperties} align="right">
    <Layer>
      <Form>
        <Box direction="row" align="center" justify="center">
          <Box align="start" justify="center" basis="1/2">
            <Text>{intl.formatMessage({ id: "app.send.event" })}</Text>
          </Box>
          <Box align="end" justify="center" basis="1/2">
            <Button
              title={"Close"}
              icon={<Close size="medium" />}
              onClick={hideTransitionProperties}
            />
          </Box>
        </Box>
        <FormField>
          <fieldset>
            <label htmlFor="componentName">
              {intl.formatMessage({ id: "app.component" })} : {currentComponent}
            </label>
          </fieldset>
        </FormField>

        <FormField>
          <fieldset>
            <label htmlFor="stateMachineTarget">
              {intl.formatMessage({ id: "app.state.machine" })} : {stateMachine}
            </label>
          </fieldset>
        </FormField>

        <FormField>
          <fieldset>
            <label htmlFor="messageType">
              {intl.formatMessage({ id: "app.message.type" })} : {messageType}
            </label>
          </fieldset>
        </FormField>

        <FormField>
          <fieldset>
            <label htmlFor="instances">
              {intl.formatMessage({ id: "app.instance.identifier" })}
              <Instances
                onChange={setCurrentId}
                stateMachine={stateMachine}
                instances={instances}
              />
            </label>
          </fieldset>
        </FormField>

        <FormField>
          <fieldset>
            <label htmlFor="instances">
              <Box direction={"row"}>
                <Box
                  pad={{
                    horizontal: "none",
                    vertical: "small",
                  }}
                >
                  {intl.formatMessage({ id: "app.topic" })}
                </Box>
                <Box>
                  <TextInput
                    value={privateTopic}
                    suggestions={privateTopics}
                    onSelect={(e) => {
                      setPrivateTopic(e.suggestion);
                    }}
                    // onDOMChange={(e) => {
                    //   setPrivateTopic(e.target.value);
                    // }}
                  />
                </Box>
              </Box>
            </label>
          </fieldset>
        </FormField>

        <FormField>
          <fieldset>
            <label htmlFor="jsonEvent">
              {intl.formatMessage({ id: "app.json.event" })}:
              <textarea
                defaultValue={jsonMessageString}
                onChange={(e) => {
                  setJsonMessageString(e.currentTarget.value);
                }}
              ></textarea>
            </label>
          </fieldset>
        </FormField>

        <Footer>
          <Button
            primary={true}
            type="button"
            label={intl.formatMessage({ id: "app.send" })}
            onClick={() => {
              if (
                currentComponent &&
                messageType &&
                jsonMessageString &&
                privateTopic
              ) {
                send(
                  currentComponent,
                  stateMachine,
                  messageType,
                  jsonMessageString,
                  privateTopic
                );
              }
              hideTransitionProperties();
            }}
          />
          <Button
            primary={true}
            type="button"
            label={intl.formatMessage({ id: "app.send.context" })}
            onClick={() => {
              if (
                stateMachineRef &&
                messageType &&
                jsonMessageString &&
                privateTopic
              ) {
                sendContext(
                  stateMachineRef,
                  messageType,
                  jsonMessageString,
                  privateTopic
                );
              }
              hideTransitionProperties();
            }}
          />
        </Footer>
      </Form>
    </Layer>
  );
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(TransitionProperties))
);
