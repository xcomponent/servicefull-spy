import { Reducer } from "redux";
import {
  GlobalTransitionPropertiesAction,
  HIDE_TRANSITION_PROPERTIES,
  SHOW_TRANSITION_PROPERTIES,
  ShowTransitionPropertiesAction,
  SET_JSON_MESSAGE_STRING,
  SetJsonMessageStringAction,
  SET_CURRENT_ID,
  SetCurrentIdAction,
  SET_PRIVATE_TOPIC,
  SetPrivateTopicAction,
  SEND,
  SendAction,
  SEND_CONTEXT,
  SendContextAction,
} from "../actions/transitionProperties";
import { send, sendContext } from "../core";

export interface TransitionPropertiesState {
  active: boolean;
  stateMachine: string | undefined;
  messageType: string | undefined;
  jsonMessageString: string | undefined;
  id: string | undefined;
  defaultPrivateTopic: string | undefined;
  privateTopics: string[];
}

const initialState: TransitionPropertiesState = {
  active: false,
  stateMachine: undefined,
  messageType: undefined,
  jsonMessageString: undefined,
  id: undefined,
  defaultPrivateTopic: undefined,
  privateTopics: [],
};

export const transitionPropertiesReducer: Reducer<TransitionPropertiesState> = (
  state: TransitionPropertiesState = initialState,
  action: GlobalTransitionPropertiesAction
): TransitionPropertiesState => {
  switch (action.type) {
    case HIDE_TRANSITION_PROPERTIES:
      return {
        ...state,
        active: false,
      };
    case SHOW_TRANSITION_PROPERTIES:
      const showTransitionPropertiesAction =
        action as ShowTransitionPropertiesAction;
      return {
        ...state,
        active: true,
        stateMachine: showTransitionPropertiesAction.stateMachine,
        messageType: showTransitionPropertiesAction.messageType,
        jsonMessageString: showTransitionPropertiesAction.jsonMessageString,
        id: showTransitionPropertiesAction.id,
        defaultPrivateTopic: showTransitionPropertiesAction.privateTopic,
        privateTopics: showTransitionPropertiesAction.privateTopics,
      };
    case SET_JSON_MESSAGE_STRING:
      const setJsonMessageStringAction = action as SetJsonMessageStringAction;
      return {
        ...state,
        jsonMessageString: setJsonMessageStringAction.jsonMessageString,
      };
    case SET_CURRENT_ID:
      const setCurrentIdAction = action as SetCurrentIdAction;
      return {
        ...state,
        id: setCurrentIdAction.id,
      };
    case SET_PRIVATE_TOPIC:
      const setPrivateTopicAction = action as SetPrivateTopicAction;
      return {
        ...state,
        defaultPrivateTopic: setPrivateTopicAction.privateTopic,
      };
    case SEND:
      const sendAction = action as SendAction;
      send(
        sendAction.component,
        sendAction.stateMachine,
        sendAction.messageType,
        sendAction.jsonMessageString,
        sendAction.privateTopic
      );
      return state;
    case SEND_CONTEXT:
      const sendContextAction = action as SendContextAction;
      sendContext(
        sendContextAction.stateMachineRef,
        sendContextAction.messageType,
        sendContextAction.jsonMessageString,
        sendContextAction.privateTopic
      );
      return state;
  }
  return state;
};
