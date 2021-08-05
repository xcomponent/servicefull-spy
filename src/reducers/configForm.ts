import { Reducer } from "redux";
import {
  FORM_SUBMIT,
  GetApiListAction,
  GET_API_LIST,
  GlobalConfigFormAction,
  SelectApiAction,
  SELECT_API,
  SetServerUrlAction,
  SET_SERVER_URL,
} from "../actions/configForm";

export interface ConfigFormState {
  apis: string[];
  selectedApi: string | undefined;
  serverHost: string | undefined;
  serverPort: number | undefined;
  serverIsSecured: boolean | undefined;
  formSubmited: boolean;
}

const initialState = {
  apis: [],
  selectedApi: undefined,
  serverHost: "127.0.0.1",
  serverPort: 9880,
  serverIsSecured: false,
  formSubmited: false,
};

const defaultAction: GlobalConfigFormAction = {
  type: undefined,
  serverHost: undefined,
  serverPort: undefined,
  serverIsSecured: undefined,
  apis: undefined,
  selectedApi: undefined,
};

export const configFormReducer: Reducer<ConfigFormState> = (
  state: ConfigFormState = initialState,
  action: GlobalConfigFormAction = defaultAction
): ConfigFormState => {
  switch (action.type) {
    case GET_API_LIST:
      const getApiListAction = action as GetApiListAction;
      return {
        ...state,
        serverUrl: getApiListAction.serverUrl,
        apis: getApiListAction.apis,
        selectedApi: getApiListAction.apis[0],
      };
    case SELECT_API:
      const selectApiAction = action as SelectApiAction;
      return {
        ...state,
        selectedApi: selectApiAction.selectedApi,
      };
    case FORM_SUBMIT:
      if (state.serverUrl && state.selectedApi) {
        return {
          ...state,
          formSubmited: true,
        };
      } else {
        return state;
      }
    case SET_SERVER_URL:
      const setSeverUrlAction = action as SetServerUrlAction;
      return {
        ...state,
        serverUrl: setSeverUrlAction.serverUrl,
      };
  }
  return state;
};
