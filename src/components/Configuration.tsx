import { injectIntl, WrappedComponentProps } from "react-intl";
import sessionXCSpy from "../utils/sessionXCSpy";
import {
  Box,
  Form,
  Header,
  Heading,
  FormField,
  TextInput,
  Button,
  CheckBox,
  Spinner,
  Select,
} from "grommet";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../utils/routes";

interface ConfigurationProps extends WrappedComponentProps {}

export const buildUrl = (
  host: string,
  port: number,
  secure: boolean
): string => {
  return secure ? `wss://${host}:${port}` : `ws://${host}:${port}`;
};

const Configuration = ({ intl }: ConfigurationProps) => {
  const history = useHistory();
  const [host, setHost] = useState<string>("localhost");
  const [port, setPort] = useState<number>(9880);
  const [secure, setSecure] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [apis, setApis] = useState<string[] | null>(null);
  const [selectedApi, setSelectedApi] = useState<string>();

  if (loading) {
    return (
      <Box
        justify="center"
        direction="row"
        align="center"
        style={{ height: "100%" }}
      >
        <Spinner size="large" />
      </Box>
    );
  }

  let form = undefined;

  if (apis) {
    form = (
      <Form
        style={{ width: "30%" }}
        onSubmit={() => {
          history.push(
            routes.paths.app +
              `?${routes.params.host}=${encodeURI(host)}&${
                routes.params.port
              }=${port}&${routes.params.secure}=${secure}&${
                routes.params.api
              }=${selectedApi}`
          );
        }}
        onReset={() => setApis(null)}
      >
        <FormField name="name" htmlFor="select-api" label="Api">
          <Select
            id="select-api"
            placeholder={intl.formatMessage({ id: "app.api" })}
            options={apis}
            value={selectedApi}
            onChange={(e) => {
              setSelectedApi(e.value);
            }}
          />
        </FormField>
        <Box
          justify="center"
          direction="row"
          gap="medium"
          style={{ marginTop: "5%" }}
        >
          <Button
            type="reset"
            label={intl.formatMessage({ id: "app.configuration.back" })}
          />
          <Button
            type="submit"
            primary
            label={intl.formatMessage({ id: "app.configuration.selectApi" })}
          />
        </Box>
      </Form>
    );
  } else {
    form = (
      <Form
        style={{ width: "30%" }}
        onSubmit={() => {
          setLoading(true);
          sessionXCSpy
            .getXcApiList(buildUrl(host, port, secure))
            .then((apis: string[]) => {
              setApis(apis);
              if (apis.length > 0) {
                setSelectedApi(apis[0]);
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <FormField name="name" htmlFor="host" label="Host">
          <TextInput
            id="host"
            name="host"
            value={host}
            onChange={(event) => setHost(event.target.value)}
            onSuggestionSelect={(event) => setHost(event.suggestion)}
            suggestions={["127.0.0.1", "localhost"]}
          />
        </FormField>
        <FormField name="name" htmlFor="port" label="Port">
          <TextInput
            id="port"
            name="port"
            type="number"
            value={port}
            onChange={(event) => setPort(parseInt(event.target.value))}
            onSuggestionSelect={(event) => setPort(event.suggestion)}
            suggestions={["9880", "443", "8080", "80"]}
          />
        </FormField>
        <FormField name="name" htmlFor="secure" label="Secure ?">
          <CheckBox
            id="secure"
            checked={secure}
            label=""
            onChange={(event) => setSecure(event.target.checked)}
          />
        </FormField>
        <Box align="center" style={{ marginTop: "5%" }}>
          <Button
            type="submit"
            primary
            label={intl.formatMessage({ id: "app.configuration.connect" })}
          />
        </Box>
      </Form>
    );
  }

  return (
    <Box fill={true}>
      <Box pad="medium" align="center" justify="center" flex={true}>
        <Header>
          <Box
            align="center"
            justify="between"
            flex={true}
            style={{ marginBottom: "10%" }}
          >
            <Heading level="2">
              {intl.formatMessage({ id: "app.configuration.form" })}
            </Heading>
          </Box>
        </Header>
        {form}
      </Box>
    </Box>
  );
};

export default injectIntl(Configuration) as any;
