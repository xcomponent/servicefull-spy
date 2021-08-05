import { SessionState } from "http2";
import { combineReducers } from "redux";
import { LOGOUT } from "../actions/session";
import { componentsReducer, ComponentsState } from "./components";
import {
  compositionModelReducer,
  CompositionModelState,
} from "./compositionModel";
import { configFormReducer, ConfigFormState } from "./configForm";
import { sessionReducer } from "./session";
import { sideBarReducer, SideBarState } from "./sideBar";
import {
  stateMachinePropertiesReducer,
  StateMachinePropertiesState,
} from "./stateMachineProperties";
import {
  transitionPropertiesReducer,
  TransitionPropertiesState,
} from "./transitionProperties";

export interface XCSpyState {
  configForm: ConfigFormState;
  compositionModel: CompositionModelState;
  components: ComponentsState;
  stateMachineProperties: StateMachinePropertiesState;
  sideBar: SideBarState;
  transitionProperties: TransitionPropertiesState;
  session: SessionState;
}

export const SpyReducer = combineReducers({
  configForm: configFormReducer,
  compositionModel: compositionModelReducer,
  components: componentsReducer,
  stateMachineProperties: stateMachinePropertiesReducer,
  sideBar: sideBarReducer,
  transitionProperties: transitionPropertiesReducer,
  session: sessionReducer,
});

export const RootReducer = (state: any, action: any) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return SpyReducer(state, action);
};
