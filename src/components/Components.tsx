import * as React from "react";
import { connect } from "react-redux";
import { Parser } from "../utils/parser";
import { DrawComponent } from "../utils/drawComponent";
import * as go from "../gojs/go";
import { backgroundColor } from "../utils/graphicColors";
import { XCSpyState } from "../reducers/spyReducer";
import { ComponentProperties } from "../reducers/components";
import { withRouter } from "react-router-dom";
import { routes } from "../utils/routes";
import { StateMachineInstance, CompositionModel } from "reactivexcomponent.js";
import {
  clearFinalStates,
  initialization,
  snapshotEntryPointAction,
  subscribeAllStateMachinesAction,
  updateGraphic,
} from "../actions/components";
import { Box, Diagram } from "grommet";
import { showStateMachineProperties } from "../actions/stateMachineProperties";
import { showTransitionProperties } from "../actions/transitionProperties";

interface ComponentsGlobalProps
  extends ComponentsProps,
    ComponentsCallbackProps {}

interface ComponentsProps {
  currentComponent: string;
  diagram: go.Diagram | null;
  compositionModel: CompositionModel | undefined;
}

interface ComponentsCallbackProps {
  initialization: (
    componentProperties: { [componentName: string]: ComponentProperties },
    currentComponent: string,
    projectName: string
  ) => void;
  showStateMachineProperties: (component: string, stateMachine: string) => void;
  updateGraphic: (
    component: string,
    stateMachine: string,
    data: StateMachineInstance
  ) => void;
  showTransitionProperties: (
    component: string,
    stateMachine: string,
    messageType: string,
    jsonMessageString: string
  ) => void;
  clearFinalStates: (component: string, stateMachines: string[]) => void;
  subscribeAllStateMachines: (
    component: string,
    stateMachines: string[]
  ) => void;
  snapshotEntryPoint: (component: string, entryPoint: string) => void;
}

const mapStateToProps = (state: XCSpyState, ownProps: any): ComponentsProps => {
  const urlSearchParams = new URLSearchParams(ownProps.location.search);
  const currentComponent = urlSearchParams.get(routes.params.currentComponent)!;
  const componentProperties = state.components.componentProperties;
  const diagram = !state.components.initialized
    ? null
    : componentProperties[currentComponent].diagram;
  return {
    currentComponent,
    diagram,
    compositionModel: state.compositionModel.value,
  };
};

const mapDispatchToProps = (dispatch: any): ComponentsCallbackProps => {
  return {
    initialization: (
      componentProperties: { [componentName: string]: ComponentProperties },
      currentComponent: string,
      projectName: string
    ): void => {
      dispatch(
        initialization(componentProperties, currentComponent, projectName)
      );
    },
    showStateMachineProperties: (
      component: string,
      stateMachine: string
    ): void => {
      dispatch(showStateMachineProperties(component, stateMachine));
    },
    updateGraphic: (
      component: string,
      stateMachine: string,
      data: StateMachineInstance
    ): void => {
      dispatch(updateGraphic(component, stateMachine, data));
    },
    showTransitionProperties: (
      component: string,
      stateMachine: string,
      messageType: string,
      jsonMessageString: string
    ): void => {
      dispatch(
        showTransitionProperties(
          component,
          stateMachine,
          messageType,
          jsonMessageString
        )
      );
    },
    clearFinalStates: (component: string, stateMachines: string[]): void => {
      for (let i = 0; i < stateMachines.length; i++) {
        dispatch(clearFinalStates(component, stateMachines[i]));
      }
    },
    subscribeAllStateMachines: (
      component: string,
      stateMachines: string[]
    ): void => {
      dispatch(subscribeAllStateMachinesAction(component, stateMachines));
    },
    snapshotEntryPoint: (component: string, entryPoint: string): void => {
      dispatch(snapshotEntryPointAction(component, entryPoint));
    },
  };
};

class Components extends React.Component<ComponentsGlobalProps, XCSpyState> {
  constructor(props: ComponentsGlobalProps) {
    super(props);
    this.getContainersForGraphs = this.getContainersForGraphs.bind(this);
    this.addDiagramEventClick = this.addDiagramEventClick.bind(this);
  }

  addDiagramEventClick(diagram: go.Diagram): void {
    const props = this.props;
    diagram.addDiagramListener(
      "ObjectDoubleClicked",
      (diagramEvent: go.DiagramEvent) => {
        const data = diagramEvent.subject.part.data;
        if (data.isGroup) {
          // it is a stateMachine
          props.showStateMachineProperties(
            this.props.currentComponent,
            data.key
          );
        } else if (data.stateMachineTarget) {
          // it is a transition
          props.showTransitionProperties(
            this.props.currentComponent,
            data.stateMachineTarget,
            data.messageType,
            "{}"
          );
        }
      }
    );
  }

  componentDidMount() {
    const props = this.props;
    const componentProperties: { [key: string]: any } = {};
    if (props.compositionModel) {
      const components = props.compositionModel.components;
      components.forEach((component) => {
        const parser = new Parser(component);
        parser.parse();
        props.subscribeAllStateMachines(
          parser.getComponentName(),
          parser.getStateMachineNames()
        );
        props.snapshotEntryPoint(
          parser.getComponentName(),
          parser.getEntryPointStateMachine()
        );
        const drawComponent = new DrawComponent();
        drawComponent.draw(parser, parser.getComponentName());
        const stateMachineProperties: { [key: string]: any } = {};
        for (let k = 0; k < parser.getStateMachineNames().length; k++) {
          stateMachineProperties[parser.getStateMachineNames()[k]] = {};
        }
        componentProperties[parser.getComponentName()] = {
          diagram: drawComponent.diagram,
          stateMachineProperties,
          finalStates: parser.getFinalStates(),
          entryPointState: parser.getEntryPointState(),
        };
        this.addDiagramEventClick(drawComponent.diagram!);
      });

      if (this.props.diagram) {
        this.props.diagram.requestUpdate();
      }

      props.initialization(
        componentProperties,
        components[0].name,
        props.compositionModel.projectName
      );
    }
  }

  getContainersForGraphs() {
    const props = this.props;
    let visibility;
    if (props.compositionModel) {
      const divs = props.compositionModel.components.map((component) => {
        visibility =
          component.name === props.currentComponent ? "block" : "none";
        return (
          <div
            key={component.name}
            id={component.name}
            style={{
              height: "100%",
              width: "100%",
              display: visibility,
              backgroundColor: backgroundColor,
            }}
          ></div>
        );
      });

      return divs;
    }
    return [];
  }

  render() {
    return <Box fill={true}>{this.getContainersForGraphs()}</Box>;
  }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Components)
);
