import * as go from "../gojs/go";
import { Parser } from "./parser";
import { stateMachineColor } from "./graphicColors";
import { NodeDataArrayTemplate, LinkDataArrayTemplate } from "./gojsTemplates";

export class DrawComponent {
  public diagram: go.Diagram | undefined;

  draw(parser: Parser, divId: string): void {
    this.diagram = this.createDiagram(divId);
    this.diagram.nodeTemplate = this.getNodeTemplate();
    this.diagram.nodeTemplateMap.add("LinkLabel", this.getLinkLabelTemplate());
    this.diagram.groupTemplate = this.getGroupTemplate();
    this.diagram.linkTemplate = this.getLinkTemplate();
    this.diagram.model = this.getModel(
      parser.getNodeDataArray(),
      parser.getLinkDataArray()
    );
  }

  private createDiagram(divId: string): go.Diagram {
    const thisObject = this;
    const diagram = go.GraphObject.make(go.Diagram, divId, {
      contentAlignment: go.Spot.Center,
      InitialLayoutCompleted: (e: any) => {
        thisObject.loadControls(e.diagram);
      },
    });
    return diagram;
  }

  private loadControls(diagram: any): void {
    diagram.links.each((link: any) => {
      const arr = link.data.controls;
      if (!Array.isArray(arr) || arr.length < 4) return;
      const from = link.fromPort;
      const to = link.toPort;
      if (from === null || to === null) return;
      let firstPoint, firstControlPoint, secondControlPoint, lastPoint;
      if (arr.length === 4) {
        firstControlPoint = new go.Point(arr[0], arr[1]);
        secondControlPoint = new go.Point(arr[2], arr[3]);
        firstPoint = link.getLinkPointFromPoint(
          from.part,
          from,
          from.getDocumentPoint(go.Spot.Center),
          firstControlPoint,
          true
        );
        lastPoint = link.getLinkPointFromPoint(
          to.part,
          to,
          to.getDocumentPoint(go.Spot.Center),
          secondControlPoint,
          false
        );
      } else if (arr.length === 6) {
        firstControlPoint = new go.Point(arr[0], arr[1]);
        secondControlPoint = new go.Point(arr[2], arr[3]);
        lastPoint = new go.Point(arr[4], arr[5]);
        firstPoint = link.getLinkPointFromPoint(
          from.part,
          from,
          from.getDocumentPoint(go.Spot.Center),
          firstControlPoint,
          true
        );
      }
      const list = new go.List();
      list.add(firstPoint);
      list.add(firstControlPoint);
      list.add(secondControlPoint);
      list.add(lastPoint);
      link.points = list;
    });
  }

  private getLinkLabelTemplate(): go.Part {
    const linkLabelTemplate = go.GraphObject.make(
      go.Node,
      {
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        layerName: "Foreground",
      }, // always have link label nodes in front of Links
      (go.TextBlock, // this is a Link label
      new go.Binding("text", "text"))
    );
    return linkLabelTemplate;
  }

  private getNodeTemplate(): go.Part {
    const nodeTemplate = go.GraphObject.make(
      go.Node,
      "Vertical",
      {
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: "SHAPE",
      },
      go.GraphObject.make(
        go.TextBlock,
        { stroke: "white", margin: 2 },
        new go.Binding("text"),
        new go.Binding("numberOfInstances")
      ),
      go.GraphObject.make(
        go.Shape,
        "Ellipse",
        {
          name: "SHAPE",
          strokeWidth: 2,
          desiredSize: new go.Size(30, 30),
          portId: "",
        },
        new go.Binding("fill", "fill"),
        new go.Binding("stroke", "stroke")
      ),
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      new go.Binding("visible", "visible")
    );
    return nodeTemplate;
  }

  private getGroupTemplate(): go.Group {
    const groupTemplate = go.GraphObject.make(
      go.Group,
      "Auto",
      go.GraphObject.make(go.Shape, "Rectangle", { fill: stateMachineColor }),
      go.GraphObject.make(
        go.Panel,
        "Vertical",
        {
          margin: 5,
          defaultAlignment: go.Spot.Center,
        },
        go.GraphObject.make(
          go.TextBlock,
          { alignment: go.Spot.Center, font: "Bold 12pt Sans-Serif" },
          new go.Binding("text", "text")
        ),
        go.GraphObject.make(go.Placeholder),
        { padding: 5 }
      )
    );
    return groupTemplate;
  }

  private getLinkTemplate(): go.Link {
    const linkTemplate = go.GraphObject.make(
      go.Link,
      { curve: go.Link.Bezier, adjusting: go.Link.Stretch, reshapable: true },
      go.GraphObject.make(go.Shape, new go.Binding("stroke", "strokeLink")),
      go.GraphObject.make(
        go.Shape,
        { toArrow: "Standard" },
        new go.Binding("fill", "fillArrow"),
        new go.Binding("stroke", "strokeArrow")
      )
    );
    return linkTemplate;
  }

  private getModel(
    nodeDataArray: Array<NodeDataArrayTemplate>,
    linkDataArray: Array<LinkDataArrayTemplate>
  ): go.Model {
    const data = {
      class: "go.GraphLinksModel",
      linkLabelKeysProperty: "labelKeys",
      nodeDataArray: nodeDataArray,
      linkDataArray: linkDataArray,
    };
    return go.Model.fromJson(data);
  }
}
