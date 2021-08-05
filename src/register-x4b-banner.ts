import "x4b-ui";

/* eslint-disable */
import {
  JSX as LocalJSX,
  defineCustomElements,
  applyPolyfills,
} from "x4b-ui/loader";
import { HTMLAttributes, MutableRefObject } from "react";
//https://github.com/ionic-team/stencil/issues/1090#issuecomment-501124883
type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, "className"> & {
      class?: string;
      ref?:
        | MutableRefObject<HTMLX4bUiElement | undefined>
        | ((node: HTMLX4bUiElement | undefined) => void);
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}

applyPolyfills().then(() => defineCustomElements(window));
