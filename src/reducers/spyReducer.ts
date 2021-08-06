import { SessionState } from "http2";
import { combineReducers } from "redux";
import { LOGOUT } from "../actions/session";
import { componentsReducer, ComponentsState } from "./components";
import {
  compositionModelReducer,
  CompositionModelState,
} from "./compositionModel";
import { sessionReducer } from "./session";
import {
  stateMachinePropertiesReducer,
  StateMachinePropertiesState,
} from "./stateMachineProperties";
import {
  transitionPropertiesReducer,
  TransitionPropertiesState,
} from "./transitionProperties";

export interface XCSpyState {
  compositionModel: CompositionModelState;
  components: ComponentsState;
  stateMachineProperties: StateMachinePropertiesState;
  transitionProperties: TransitionPropertiesState;
  session: SessionState;
}

export const SpyReducer = combineReducers({
  compositionModel: compositionModelReducer,
  components: componentsReducer,
  stateMachineProperties: stateMachinePropertiesReducer,
  transitionProperties: transitionPropertiesReducer,
  session: sessionReducer,
});

export const RootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return SpyReducer(state, action);
};
