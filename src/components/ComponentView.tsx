import { injectIntl, WrappedComponentProps } from "react-intl";
import { Box, Diagram, Grid, Heading, Sidebar, Spinner } from "grommet";
import { useState } from "react";
import { Component } from "reactivexcomponent.js/dist/communication/xcomponentMessages";
import Components from "./Components";
import {
  activeStateColor,
  backgroundColor,
  stateColor,
} from "../utils/graphicColors";
import { useEffect } from "react";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import { ComponentProperties, Instance } from "../reducers/components";
import sessionXCSpy from "../utils/sessionXCSpy";
import { Session, StateMachineInstance } from "reactivexcomponent.js";
import { modelTags } from "../utils/configurationParser";
import go from "../gojs/go";

export const UPDATE_GRAPHIC = "UPDATE_GRAPHIC";

interface ComponentViewProps extends WrappedComponentProps {
  component: Component;
}

const ComponentView = ({ intl, component }: ComponentViewProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [componentProperties, setComponentProperties] =
    useState<ComponentProperties | null>(null);
  const [selectedElement, setSelectedElement] = useState<
    string | { stateMachineTarget: string; messageType: string }
  >();

  const addDiagramEventClick = (diagram: go.Diagram): void => {
    diagram.addDiagramListener(
      "ObjectDoubleClicked",
      (diagramEvent: go.DiagramEvent) => {
        const data = diagramEvent.subject.part.data;
        if (data.isGroup) {
          setSelectedElement(data.key);
        } else if (data.stateMachineTarget) {
          setSelectedElement({
            stateMachineTarget: data.stateMachineTarget,
            messageType: data.messsateType,
          });
        }
      }
    );
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

  const UpdateGraphic = (
    stateMachine: string,
    stateMachineInstance: StateMachineInstance,
    componentProperties: ComponentProperties
  ) => {
    if (componentProperties) {
      const stateMachineId =
        stateMachineInstance.stateMachineRef.StateMachineId;
      const instances =
        componentProperties.stateMachineProperties[stateMachine];
      const nodeData =
        componentProperties.diagram.findNodeForKey(stateMachine).data;
      const newState = stateMachineInstance.stateMachineRef.StateName;
      const newStateKey = stateMachine + modelTags.Separator + newState;
      const finalStates = componentProperties.finalStates;
      const entryPointState = componentProperties.entryPointState;
      componentProperties.diagram.model.startTransaction(UPDATE_GRAPHIC);
      if (instances[stateMachineId]) {
        const oldState = instances[stateMachineId].stateMachineRef.StateName;
        if (oldState !== newState) {
          updateState(
            componentProperties.diagram,
            newStateKey,
            finalStates,
            entryPointState,
            +1,
            false
          );
          console.error(
            "-1 on " +
              stateMachine +
              modelTags.Separator +
              oldState +
              " new state " +
              newStateKey
          );
          updateState(
            componentProperties.diagram,
            stateMachine + modelTags.Separator + oldState,
            finalStates,
            entryPointState,
            -1,
            false
          );
        }
      } else {
        componentProperties.diagram.model.setDataProperty(
          nodeData,
          "numberOfInstances",
          nodeData.numberOfInstances + 1
        );
        updateState(
          componentProperties.diagram,
          newStateKey,
          finalStates,
          entryPointState,
          +1,
          false
        );
      }
      const instance: Instance = {
        jsonMessage: stateMachineInstance.jsonMessage,
        stateMachineRef: stateMachineInstance.stateMachineRef,
        isFinal: componentProperties.finalStates.indexOf(newStateKey) > -1,
      };
      instances[stateMachineId] = instance;
      componentProperties.diagram.model.setDataProperty(
        nodeData,
        "numberOfInstances",
        nodeData.numberOfInstances
      );
      componentProperties.diagram.model.setDataProperty(
        nodeData,
        "text",
        `${nodeData.key} (${nodeData.numberOfInstances})`
      );
      componentProperties.diagram.model.commitTransaction(UPDATE_GRAPHIC);
    }
  };

  useEffect(() => {
    const parser = new Parser(component);
    parser.parse();
    let stateMachines = parser.getStateMachineNames();

    // props.snapshotEntryPoint(
    //   parser.getComponentName(),
    //   parser.getEntryPointStateMachine()
    // );
    let isSubscribed = true;
    const drawComponent = new DrawComponent();
    drawComponent.draw(parser, parser.getComponentName());
    const stateMachineProperties: { [key: string]: any } = {};
    stateMachines.forEach((stateMachine) => {
      stateMachineProperties[stateMachine] = {};
    });
    const componentProperties = {
      diagram: drawComponent.diagram!,
      stateMachineProperties,
      finalStates: parser.getFinalStates(),
      entryPointState: parser.getEntryPointState(),
    };
    setComponentProperties(componentProperties);
    addDiagramEventClick(drawComponent.diagram!);

    sessionXCSpy.PromiseCreateSession.then((session: Session) => {
      stateMachines.forEach((stateMachine) => {
        if (session.canSubscribe(component.name, stateMachine)) {
          session.subscribe(component.name, stateMachine, {
            onStateMachineUpdate: (stateMachineInstance) => {
              if (isSubscribed) {
                UpdateGraphic(
                  stateMachine,
                  stateMachineInstance,
                  componentProperties
                );
              }
            },
          });
        }
      });
    });

    return () => {
      isSubscribed = false;
      if (drawComponent.diagram) {
        drawComponent.diagram.clear();
        drawComponent.diagram.div = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <Box
        justify="center"
        align="center"
        style={{ width: "100%", backgroundColor: "lightgray" }}
      >
        <Heading level="2" style={{ marginBottom: 50 }}>
          {component.name}
        </Heading>
        <Spinner size="small" />
      </Box>
    );
  }

  return (
    <Grid
      rows={["100%"]}
      columns={["flex", "240px"]}
      gap="none"
      areas={[
        { name: "diagram", start: [0, 0], end: [0, 0] },
        { name: "parameters", start: [1, 0], end: [1, 0] },
      ]}
      style={{
        width: "100%",
      }}
    >
      <Box gridArea="diagram">
        <div
          key={component.name}
          id={component.name}
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: backgroundColor,
          }}
        ></div>
      </Box>
      <Box gridArea="parameters" background="brand" />
    </Grid>
  );
};

export default injectIntl(ComponentView) as any;
