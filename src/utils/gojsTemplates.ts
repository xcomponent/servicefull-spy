export interface LinkLabelTemplate {
  key: string;
  category: string;
  text: string;
}

export interface StateTemplate {
  key: string | undefined;
  text: string | undefined;
  group: string;
  stateName: string;
  numberOfStates: number;
  fill: string;
  stroke: string;
  loc: string | undefined;
  visible: boolean;
  fatalError: boolean;
}

export interface StateMachineTemplate {
  key: string;
  text: string | undefined;
  isGroup: boolean;
  numberOfInstances: number;
}

export interface LinkInterface {
  key: string;
  from: string;
  to: string;
  triggerable: boolean;
  controls: Array<number>;
}

export interface TransitionTemplate extends LinkInterface {
  strokeLink: string;
  strokeArrow: string;
  fillArrow: string;
}

export interface TriggerableTransitionTemplate extends LinkInterface {
  stateMachineTarget: string;
  text: string | undefined;
  messageType: string;
  labelKeys: Array<String>;
}

export type LinkDataArrayTemplate =
  | TransitionTemplate
  | TriggerableTransitionTemplate;
export type NodeDataArrayTemplate =
  | StateMachineTemplate
  | StateTemplate
  | LinkLabelTemplate;
