import sessionXCSpy from "./utils/sessionXCSpy";
import { Dispatch, Action } from "redux";
import { Session, StateMachineRef } from "reactivexcomponent.js";
import { updateGraphic } from "./actions/components";
import { initCompositionModelAction } from "./actions/compositionModel";

export const getCompositionModel = (
  dispatch: Dispatch<Action>,
  api: string,
  serverUrl: string
): void => {
  sessionXCSpy.getCompositionModel(serverUrl, api).then((compositionModel) => {
    dispatch(initCompositionModelAction(compositionModel));
  });
};

export const subscribeAllStateMachines = (
  dispatch: any,
  component: string,
  stateMachines: string[]
): void => {
  sessionXCSpy.PromiseCreateSession.then((session: Session) => {
    for (let j = 0; j < stateMachines.length; j++) {
      if (!session.canSubscribe(component, stateMachines[j])) continue;
      ((stateMachine: string) => {
        session.subscribe(component, stateMachine, {
          onStateMachineUpdate: (data) => {
            dispatch(updateGraphic(component, stateMachine, data));
          },
        });
      })(stateMachines[j]);
    }
  });
};

export const snapshotEntryPoint = (
  dispatch: Dispatch<Action>,
  component: string,
  entryPoint: string
): void => {
  snapshot(dispatch, component, entryPoint);
};

export const snapshot = (
  dispatch: any,
  component: string,
  stateMachine: string
): void => {
  sessionXCSpy.PromiseCreateSession.then((session: Session) => {
    session.getSnapshot(component, stateMachine).then((snapshot) => {
      snapshot.forEach((element) => {
        dispatch(updateGraphic(component, stateMachine, element));
      });
    });
  });
};

export const snapshotAll = (
  dispatch: Dispatch<Action>,
  component: string,
  stateMachines: string[]
): void => {
  stateMachines.forEach((stateMachine) => {
    snapshot(dispatch, component, stateMachine);
  });
};

export const send = (
  component: string,
  stateMachine: string,
  messageType: string,
  jsonMessageString: string,
  privateTopic: string | undefined = undefined
) => {
  sessionXCSpy.PromiseCreateSession.then((session: Session) => {
    let jsonMessage;
    try {
      jsonMessage = JSON.parse(jsonMessageString);
      if (!privateTopic || privateTopic.length === 0) {
        session.send(component, stateMachine, messageType, jsonMessage, false);
      } else {
        if (
          session.privateTopics.getSubscriberTopics().indexOf(privateTopic) ===
          -1
        )
          session.privateTopics.addSubscriberTopic(privateTopic);
        session.send(
          component,
          stateMachine,
          messageType,
          jsonMessage,
          true,
          privateTopic
        );
      }
    } catch (e) {
      alert("Json format incorrect");
      console.error(e);
    }
  });
};

export const sendContext = (
  stateMachineRef: StateMachineRef,
  messageType: string,
  jsonMessageString: string,
  privateTopic: string | undefined = undefined
): void => {
  sessionXCSpy.PromiseCreateSession.then((session: Session) => {
    if (!stateMachineRef) {
      alert("Please select an instance!");
      return;
    }
    let jsonMessage;
    try {
      jsonMessage = JSON.parse(jsonMessageString);
      if (!privateTopic || privateTopic.length === 0) {
        stateMachineRef.send(messageType, jsonMessage, false);
      } else {
        if (
          session.privateTopics.getSubscriberTopics().indexOf(privateTopic) ===
          -1
        )
          session.privateTopics.addSubscriberTopic(privateTopic);
        stateMachineRef.send(messageType, jsonMessage, true, privateTopic);
      }
    } catch (e) {
      alert("Json format incorrect");
      console.error(e);
    }
  });
};
