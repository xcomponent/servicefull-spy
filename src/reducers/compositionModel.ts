import { Reducer } from "redux";
import { CompositionModel } from "reactivexcomponent.js";
import {
  GlobalCompositionModelAction,
  INIT_COMPOSITION_MODEL,
} from "../actions/compositionModel";

export interface CompositionModelState {
  initialized: boolean;
  value: CompositionModel | undefined;
}

const initialState = {
  initialized: false,
  value: undefined,
};

export const compositionModelReducer: Reducer<
  CompositionModelState,
  GlobalCompositionModelAction
> = (
  state: CompositionModelState = initialState,
  action: GlobalCompositionModelAction
): CompositionModelState => {
  switch (action.type) {
    case INIT_COMPOSITION_MODEL:
      return {
        initialized: true,
        value: action.compositionModel,
      };
  }
  return state;
};
