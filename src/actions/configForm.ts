import sessionXCSpy from "../utils/sessionXCSpy";
import { Action, AnyAction } from "redux";
import { actionCreatorFactory } from "typescript-fsa";

const actionCreator = actionCreatorFactory("CONNECTION");

export const setServerHost = actionCreator.async<{ serverHost: string }, {}>(
  "SET_SERVER_HOST"
);
export const setServerPort = actionCreator.async<{ serverPort: number }, {}>(
  "SET_SERVER_PORT"
);
export const setServerIsSecured = actionCreator.async<
  { serverIsSecured: boolean },
  {}
>("SET_SERVER_IS_SECURED");

export const GET_API_LIST = "GET_API_LIST";
export const SELECT_API = "SELECT_API";
export const FORM_SUBMIT = "FORM_SUBMIT";
export type GlobalConfigFormAction =
  | GetApiListAction
  | SelectApiAction
  | AnyAction;

export interface GetApiListAction extends Action {
  serverUrl: string;
  apis: string[];
}

export interface SelectApiAction extends Action {
  selectedApi: string;
}

export const getApiList = (serverUrl: string) => {
  return (dispatch: any) => {
    sessionXCSpy.getXcApiList(serverUrl).then((apis: any) => {
      dispatch({
        type: GET_API_LIST,
        serverUrl,
        apis,
      });
    });
  };
};

export const selectApi = (selectedApi: string): SelectApiAction => {
  return {
    type: SELECT_API,
    selectedApi,
  };
};

export const formSubmit = (): Action => {
  return {
    type: FORM_SUBMIT,
  };
};
