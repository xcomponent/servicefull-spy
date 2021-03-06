import { Action } from "redux";
import { Dispatch } from "redux";
import { StateMachineInstance } from "reactivexcomponent.js";
import { XCSpyState } from "../reducers/spyReducer";
import { ComponentProperties } from "../reducers/components";
import { snapshotEntryPoint, subscribeAllStateMachines } from "../core";

export const INITIALIZATION = "INITIALIZATION";
export const SET_CURRENT_COMPONENT = "SET_CURRENT_COMPONENT";
export const UPDATE_GRAPHIC = "UPDATE_GRAPHIC";
export const CLEAR_FINAL_STATES = "CLEAR_FINAL_STATES";
export const SET_AUTO_CLEAR = "SET_AUTO_CLEAR";

export type GlobalComponentsAction =
  | InitializationAction
  | UpdateGraphicAction
  | ClearFinalStatesAction
  | SetAutoClearAction;

export interface InitializationAction extends Action {
  componentProperties: { [componentName: string]: ComponentProperties };
  projectName: string;
}

export interface UpdateGraphicAction extends Action {
  data: StateMachineInstance;
  component: string;
  stateMachine: string;
}

export interface ClearFinalStatesAction extends Action {
  component: string;
  stateMachine: string;
}

export interface SetAutoClearAction extends Action {
  autoClear: boolean;
}

export const initialization = (
  componentProperties: { [componentName: string]: ComponentProperties },
  currentComponent: string,
  projectName: string
): InitializationAction => {
  return {
    type: INITIALIZATION,
    componentProperties,
    projectName,
  };
};

export const updateGraphic = (
  component: string,
  stateMachine: string,
  data: StateMachineInstance
): ((dispatch: Dispatch<Action<any>>, getState: () => XCSpyState) => void) => {
  return (dispatch: Dispatch<Action>, getState: () => XCSpyState): void => {
    dispatch({
      type: UPDATE_GRAPHIC,
      component,
      stateMachine,
      data,
    });
    if (getState().components.autoClear) {
      dispatch(clearFinalStates(component, stateMachine));
    }
  };
};

export const clearFinalStates = (
  component: string,
  stateMachine: string
): ClearFinalStatesAction => {
  return {
    type: CLEAR_FINAL_STATES,
    component,
    stateMachine,
  };
};

export const setAutoClear = (autoClear: boolean): SetAutoClearAction => {
  return {
    type: SET_AUTO_CLEAR,
    autoClear,
  };
};

export const subscribeAllStateMachinesAction = (
  component: string,
  stateMachines: string[]
): ((dispatch: Dispatch<Action>) => void) => {
  return (dispatch: Dispatch<Action>): void => {
    subscribeAllStateMachines(dispatch, component, stateMachines);
  };
};

export const snapshotEntryPointAction = (
  component: string,
  entryPoint: string
): ((dispatch: Dispatch<Action>) => void) => {
  return (dispatch: Dispatch<Action>): void => {
    snapshotEntryPoint(dispatch, component, entryPoint);
  };
};
