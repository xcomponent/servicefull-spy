import { Action } from "redux";
import { getCompositionModel } from "../core";
import { Dispatch } from "redux";
import { CompositionModel } from "reactivexcomponent.js";

export const INIT_COMPOSITION_MODEL = "INIT_COMPOSITION_MODEL";

export interface GlobalCompositionModelAction extends Action {
  compositionModel: CompositionModel;
}

export const initCompositionModelAction = (
  compositionModel: any
): GlobalCompositionModelAction => {
  return {
    type: INIT_COMPOSITION_MODEL,
    compositionModel,
  };
};

export const setCompositionModel = (
  xcApiName: string,
  serverUrl: string
): ((dispatch: Dispatch<Action<any>>) => void) => {
  return (dispatch: Dispatch<Action>): void => {
    getCompositionModel(dispatch, xcApiName, serverUrl);
  };
};
