import * as go from "../gojs/go";
import { modelTags } from "../utils/configurationParser";
import { activeStateColor, stateColor } from "../utils/graphicColors";
import { Reducer } from "redux";
import { StateMachineRef } from "reactivexcomponent.js";
import {
  ClearFinalStatesAction,
  CLEAR_FINAL_STATES,
  GlobalComponentsAction,
  INITIALIZATION,
  InitializationAction,
  SetAutoClearAction,
  SET_AUTO_CLEAR,
  UpdateGraphicAction,
  UPDATE_GRAPHIC,
} from "../actions/components";

export interface Instance {
  jsonMessage: any;
  stateMachineRef: StateMachineRef;
  isFinal: boolean;
}

export interface ComponentProperties {
  diagram: go.Diagram;
  stateMachineProperties: { [name: string]: { [id: string]: Instance } };
  finalStates: string[];
  entryPointState: string;
}

export interface ComponentsState {
  componentProperties: { [componentName: string]: ComponentProperties };
  projectName: string | undefined;
  initialized: boolean;
  autoClear: boolean;
}

const initialState: ComponentsState = {
  componentProperties: {},
  projectName: undefined,
  initialized: false,
  autoClear: false,
};

const updateState = (
  diagram: go.Diagram,
  stateKey: string,
  finalStates: string[],
  entryPointState: string,
  increment: number,
  autoClear: boolean
) => {
  const data = diagram.findNodeForKey(stateKey).data;
  if (!autoClear) {
    diagram.model.setDataProperty(data, "visible", true);
  }
  const oldValue = data.numberOfStates;
  const newValue = oldValue + increment;
  diagram.model.setDataProperty(data, "numberOfStates", newValue);
  diagram.model.setDataProperty(
    data,
    "text",
    `${data.stateName} (${data.numberOfStates})`
  );
  if (finalStates.indexOf(stateKey) > -1 || entryPointState === stateKey)
    return;
  if (newValue === 0) {
    diagram.model.setDataProperty(data, "fill", stateColor);
    diagram.model.setDataProperty(data, "stroke", stateColor);
  } else if (!data.fatalError) {
    diagram.model.setDataProperty(data, "fill", activeStateColor);
    diagram.model.setDataProperty(data, "stroke", activeStateColor);
  }
};

const clearFinalStates = (
  diagram: go.Diagram,
  finalStatesToClear: string[],
  stateMachine: string,
  numberOfInstances: number
) => {
  diagram.model.startTransaction(CLEAR_FINAL_STATES);
  for (let i = 0; i < finalStatesToClear.length; i++) {
    const stateData = diagram.findNodeForKey(finalStatesToClear[i]).data;
    // change number in state
    diagram.model.setDataProperty(stateData, "numberOfStates", 0);
    diagram.model.setDataProperty(
      stateData,
      "text",
      `${stateData.stateName} (${stateData.numberOfStates})`
    );
  }

  const errorFatalStateData = diagram.findNodeForKey(
    stateMachine + modelTags.Separator + "FatalError"
  ).data;
  const stateMachineData = diagram.findNodeForKey(stateMachine).data;
  diagram.model.setDataProperty(
    stateMachineData,
    "numberOfInstances",
    numberOfInstances - errorFatalStateData.numberOfStates
  );
  diagram.model.setDataProperty(
    stateMachineData,
    "text",
    `${stateMachineData.key} (${stateMachineData.numberOfInstances})`
  );

  diagram.model.setDataProperty(errorFatalStateData, "numberOfStates", 0);
  diagram.model.setDataProperty(errorFatalStateData, "visible", false);
  diagram.model.setDataProperty(errorFatalStateData, "text", "FatalError (0)");

  diagram.model.commitTransaction(CLEAR_FINAL_STATES);
};

export const componentsReducer: Reducer<
  ComponentsState,
  GlobalComponentsAction
> = (
  state: ComponentsState = initialState,
  action: GlobalComponentsAction
): ComponentsState => {
  let componentProperties;
  let diagram: go.Diagram;
  switch (action.type) {
    case INITIALIZATION:
      const initAction = action as InitializationAction;
      return {
        ...state,
        componentProperties: initAction.componentProperties,
        projectName: initAction.projectName,
        initialized: true,
      };
    case UPDATE_GRAPHIC:
      const updateGraphicAction = action as UpdateGraphicAction;
      componentProperties = { ...state.componentProperties };
      diagram = componentProperties[updateGraphicAction.component].diagram;
      const stateMachineId = parseInt(
        updateGraphicAction.data.stateMachineRef.StateMachineId
      );
      const instances =
        componentProperties[updateGraphicAction.component]
          .stateMachineProperties[updateGraphicAction.stateMachine];
      const nodeData = diagram.findNodeForKey(
        updateGraphicAction.stateMachine
      ).data;
      const newState = updateGraphicAction.data.stateMachineRef.StateName;
      const newStateKey =
        updateGraphicAction.stateMachine + modelTags.Separator + newState;
      const finalStates =
        componentProperties[updateGraphicAction.component].finalStates;
      const entryPointState =
        componentProperties[updateGraphicAction.component].entryPointState;
      diagram.model.startTransaction(UPDATE_GRAPHIC);
      if (instances[stateMachineId]) {
        const oldState = instances[stateMachineId].stateMachineRef.StateName;
        if (oldState !== newState) {
          updateState(
            diagram,
            newStateKey,
            finalStates,
            entryPointState,
            +1,
            state.autoClear
          );
          updateState(
            diagram,
            updateGraphicAction.stateMachine + modelTags.Separator + oldState,
            finalStates,
            entryPointState,
            -1,
            state.autoClear
          );
        }
      } else {
        diagram.model.setDataProperty(
          nodeData,
          "numberOfInstances",
          nodeData.numberOfInstances + 1
        );
        updateState(
          diagram,
          newStateKey,
          finalStates,
          entryPointState,
          +1,
          state.autoClear
        );
      }
      const instance: Instance = {
        jsonMessage: updateGraphicAction.data.jsonMessage,
        stateMachineRef: updateGraphicAction.data.stateMachineRef,
        isFinal:
          componentProperties[
            updateGraphicAction.component
          ].finalStates.indexOf(newStateKey) > -1,
      };
      instances[stateMachineId] = instance;
      diagram.model.setDataProperty(
        nodeData,
        "numberOfInstances",
        nodeData.numberOfInstances
      );
      diagram.model.setDataProperty(
        nodeData,
        "text",
        `${nodeData.key} (${nodeData.numberOfInstances})`
      );
      diagram.model.commitTransaction(UPDATE_GRAPHIC);
      return {
        ...state,
        componentProperties: componentProperties,
      };
    case CLEAR_FINAL_STATES:
      const clearFinalStatesAction = action as ClearFinalStatesAction;
      const finalStatesToClear = [];
      componentProperties = { ...state.componentProperties };
      diagram = componentProperties[clearFinalStatesAction.component].diagram;
      const stateMachineInstances =
        componentProperties[clearFinalStatesAction.component]
          .stateMachineProperties[clearFinalStatesAction.stateMachine];
      for (const id in stateMachineInstances) {
        if (
          stateMachineInstances[id].isFinal ||
          stateMachineInstances[id].stateMachineRef.StateName === "FatalError"
        ) {
          const stateKey =
            clearFinalStatesAction.stateMachine +
            modelTags.Separator +
            stateMachineInstances[id].stateMachineRef.StateName;
          finalStatesToClear.push(stateKey);
          delete stateMachineInstances[id];
        }
      }
      clearFinalStates(
        diagram,
        finalStatesToClear,
        clearFinalStatesAction.stateMachine,
        Object.keys(stateMachineInstances).length
      );
      return {
        ...state,
        componentProperties: componentProperties,
      };
    case SET_AUTO_CLEAR:
      const setAutoClearAction = action as SetAutoClearAction;
      return {
        ...state,
        autoClear: setAutoClearAction.autoClear,
      };
  }
  return state;
};
