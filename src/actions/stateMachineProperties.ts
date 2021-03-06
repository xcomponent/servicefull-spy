import { Action } from "redux";
import { Dispatch } from "redux";
import { snapshot, snapshotAll } from "../core";
import { XCSpyState } from "../reducers/spyReducer";

export const SHOW_STATE_MACHINE_PROPERTIES = "SHOW_STATE_MACHINE_PROPERTIES ";
export const HIDE_STATE_MACHINE_PROPERTIES = "HIDE_STATE_MACHINE_PROPERTIES";
export const SET_STATE_MACHINE_ID = "SET_STATE_MACHINE_ID";

export type GlobalStateMachinePropertiesAction =
  | ShowStateMachinePropertiesAction
  | SetStateMachineIdAction;

export interface ShowStateMachinePropertiesAction extends Action {
  stateMachine: string;
  id: string;
}

export interface SetStateMachineIdAction extends Action {
  id: string;
}

export const showStateMachineProperties = (
  component: string,
  stateMachine: string
): ((dispatch: Dispatch<Action<any>>, getState: () => XCSpyState) => void) => {
  return (dispatch: Dispatch<Action>, getState: () => XCSpyState) => {
    const componentProperties = getState().components.componentProperties;
    const firstId = Object.keys(
      componentProperties[component].stateMachineProperties[stateMachine]
    )[0];
    dispatch({
      type: SHOW_STATE_MACHINE_PROPERTIES,
      stateMachine,
      id: firstId,
    });
  };
};

export const hideStateMachineProperties = (): Action => {
  return {
    type: HIDE_STATE_MACHINE_PROPERTIES,
  };
};

export const setStateMachineId = (id: any): SetStateMachineIdAction => {
  return {
    type: SET_STATE_MACHINE_ID,
    id,
  };
};

export const snapshotAction = (
  currentComponent: string,
  stateMachine: string
): ((dispatch: Dispatch<Action<any>>, getState: () => XCSpyState) => void) => {
  return (dispatch: Dispatch<Action>): void => {
    snapshot(dispatch, currentComponent, stateMachine);
  };
};

export const snapshotAllAction = (
  currentComponent: string,
  stateMachines: string[]
): ((dispatch: Dispatch<Action<any>>, getState: () => XCSpyState) => void) => {
  return (dispatch: Dispatch<Action>): void => {
    snapshotAll(dispatch, currentComponent, stateMachines);
  };
};
