import { injectIntl, WrappedComponentProps } from "react-intl";
import sessionXCSpy from "../utils/sessionXCSpy";
import { Box, Button, Heading, Sidebar, Spinner } from "grommet";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { routes } from "../utils/routes";
import { useEffect } from "react";
import { CompositionModel } from "reactivexcomponent.js";
import { Services } from "grommet-icons";
import { Component } from "reactivexcomponent.js/dist/communication/xcomponentMessages";
import { buildUrl } from "./Configuration";
import ComponentView from "./ComponentView";

interface MainScreenProps extends WrappedComponentProps {
  isFullSizeMenu: boolean;
}

const MainScreen = ({ intl, isFullSizeMenu }: MainScreenProps) => {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(true);
  const [compositionModel, setCompositionModel] =
    useState<CompositionModel | null>(null);
  const [activeComponent, setActiveComponent] = useState<Component | null>(
    null
  );

  useEffect(() => {
    const values: { [key: string]: any } = {};
    history.location.search
      .replace("?", "")
      .split("&")
      .forEach((element: any) => {
        const s = element.split("=");
        values[s[0]] = s[1];
      });

    let api = values[routes.params.api];
    let url = buildUrl(
      values[routes.params.host],
      parseInt(values[routes.params.port]),
      values[routes.params.secure] === "true"
    );
    sessionXCSpy.init(api, url);
    sessionXCSpy
      .getCompositionModel(url, api)
      .then((compositionModel) => {
        setCompositionModel(compositionModel);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [history]);

  if (loading) {
    return (
      <Box
        justify="center"
        direction="column"
        align="center"
        style={{ height: "100%" }}
      >
        <Heading level="2" style={{ marginBottom: 50 }}>
          {intl.formatMessage({ id: "app.configuration.form" })}
        </Heading>
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box direction="row" height={{ min: "100%" }}>
      {isFullSizeMenu && (
        <Sidebar
          flex={false}
          height={{ min: "100%" }}
          pad="small"
          gap="small"
          background="brand"
          border={{ color: "border", style: "solid" }}
          style={{ width: 240 }}
          header={
            <Box pad="small" border={{ color: "white", side: "bottom" }}>
              {"Components"}
            </Box>
          }
        >
          {compositionModel?.components.map((component: Component) => {
            return (
              <Button
                onClick={() => {
                  setActiveComponent(component);
                }}
                active={activeComponent?.name === component.name}
              >
                <Box pad="small" direction="row" align="center" gap="small">
                  <Services />
                  {component.name}
                </Box>
              </Button>
            );
          })}
        </Sidebar>
      )}
      {activeComponent && <ComponentView component={activeComponent} />}
    </Box>
  );
};

export default injectIntl(MainScreen) as any;
