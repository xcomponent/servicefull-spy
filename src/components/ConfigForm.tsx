import { connect } from "react-redux";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { XCSpyState } from "../reducers/spyReducer";
import {
  formSubmit,
  getApiList,
  selectApi,
  setServerUrl,
} from "../actions/configForm";
import {
  Box,
  Form,
  Header,
  Heading,
  FormField,
  TextInput,
  Button,
  Select,
  CheckBox,
} from "grommet";

interface ConfigFormGlobalProps
  extends ConfigFormProps,
    ConfigFormCallbackProps {}

interface ConfigFormProps extends WrappedComponentProps {
  apis: string[];
  selectedApi: string | undefined;
  serverUrlState: string | undefined;
}

interface ConfigFormCallbackProps {
  onClickGetApiList: (serverUrl: string) => void;
  onChangeSelectedApi: (selectedApi: string) => void;
  onClickSubmit: () => void;
  onSetServerUrl: (serverUrl: string) => void;
}

const mapStateToProps = (
  state: XCSpyState,
  { intl }: ConfigFormGlobalProps
): ConfigFormProps => {
  return {
    apis: state.configForm.apis,
    selectedApi: state.configForm.selectedApi,
    serverUrlState: state.configForm.serverUrl,
    intl,
  };
};

const mapDispatchToProps = (
  dispatch: any,
  ownProps: any
): ConfigFormCallbackProps => {
  return {
    onClickGetApiList: (serverUrl: string): void => {
      dispatch(getApiList(serverUrl));
    },
    onChangeSelectedApi: (selectedApi: string): void => {
      dispatch(selectApi(selectedApi));
    },
    onClickSubmit: (): void => {
      dispatch(formSubmit());
    },
    onSetServerUrl: (serverUrl: string) => {
      // ownProps.history.push(`/form?serverUrl=${serverUrl}`);
      dispatch(setServerUrl(serverUrl));
    },
  };
};

let ConfigForm = ({
  intl,
  onClickSubmit,
  onChangeSelectedApi,
  onClickGetApiList,
  onSetServerUrl,
  apis,
  serverUrlState,
  selectedApi,
}: ConfigFormGlobalProps) => {
  return (
    <Box fill={true}>
      <Box pad="medium" align="center" justify="center" flex={true}>
        <Header>
          <Box align="center" justify="between" flex={true}>
            <Heading>
              {intl.formatMessage({ id: "app.configuration.form" })}
            </Heading>
          </Box>
        </Header>
        <Form>
          <FormField name="name" htmlFor="text-input-id" label="Host">
            <TextInput
              id="text-input-id"
              name="host"
              suggestions={["127.0.0.1", "localhost"]}
            />
          </FormField>
          <FormField name="name" htmlFor="text-input-id" label="Port">
            <TextInput
              id="text-input-id"
              name="port"
              suggestions={["9880", "443", "8080", "80"]}
            />
          </FormField>
          <FormField name="name" htmlFor="text-input-id" label="Secure ?">
            <CheckBox
              checked={true}
              label=""
              // onChange={(event) => setChecked(event.target.checked)}
            />
          </FormField>
          <Box align="end">
            <Button
              type="submit"
              primary
              label={intl.formatMessage({ id: "app.get.apis" })}
            />
          </Box>
          {/* <FormField>
            <fieldset>
              <Box fill="horizontal">
                <TextInput
                  placeholder={intl.formatMessage({ id: "app.serverURL" })}
                  id="serverUrl"
                  value={serverUrlState}
                  onChange={(e) => {
                    onSetServerUrl(e.target.value);
                  }}
                  onSelect={(e) => {
                    onSetServerUrl(e.suggestion);
                  }}
                  suggestions={["ws://localhost:9880", "wss://localhost:443"]}
                />
              </Box>

              <Box align="end">
                <Button
                  primary={true}
                  type="button"
                  label={intl.formatMessage({ id: "app.get.apis" })}
                  onClick={() => {
                    if (serverUrlState) {
                      onClickGetApiList(serverUrlState);
                    }
                  }}
                />
              </Box>
            </fieldset>
          </FormField> */}
          <FormField>
            <fieldset>
              <Select
                placeholder={intl.formatMessage({ id: "app.api" })}
                options={apis}
                value={selectedApi}
                onChange={(e) => {
                  onChangeSelectedApi(e.value);
                }}
              />
              <Box align="end">
                <Button
                  primary={true}
                  type="button"
                  label={intl.formatMessage({ id: "app.submit" })}
                  onClick={onClickSubmit}
                />
              </Box>
            </fieldset>
          </FormField>
        </Form>
      </Box>
    </Box>
  );
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ConfigForm)
) as any;
