import { Reducer } from "redux";
import {
  GlobalStateMachinePropertiesAction,
  HIDE_STATE_MACHINE_PROPERTIES,
  SHOW_STATE_MACHINE_PROPERTIES,
  ShowStateMachinePropertiesAction,
  SET_STATE_MACHINE_ID,
  SetStateMachineIdAction,
} from "../actions/stateMachineProperties";

export interface StateMachinePropertiesState {
  active: boolean;
  stateMachine: string | undefined;
  id: string | undefined;
}

const initialState = {
  active: false,
  stateMachine: undefined,
  id: undefined,
};

export const stateMachinePropertiesReducer: Reducer<
  StateMachinePropertiesState,
  GlobalStateMachinePropertiesAction
> = (
  state: StateMachinePropertiesState = initialState,
  action: GlobalStateMachinePropertiesAction
): StateMachinePropertiesState => {
  switch (action.type) {
    case HIDE_STATE_MACHINE_PROPERTIES:
      return initialState;
    case SHOW_STATE_MACHINE_PROPERTIES:
      const showStateMachinePropertiesAction =
        action as ShowStateMachinePropertiesAction;
      return {
        ...state,
        active: true,
        stateMachine: showStateMachinePropertiesAction.stateMachine,
        id: showStateMachinePropertiesAction.id,
      };
    case SET_STATE_MACHINE_ID:
      const setStateMachineIdAction = action as SetStateMachineIdAction;
      return {
        ...state,
        id: setStateMachineIdAction.id,
      };
  }
  return state;
};
