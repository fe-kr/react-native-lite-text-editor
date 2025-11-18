import type WebView from 'react-native-webview';
import type { DocumentCommand } from '../commands';
import type { DocumentCommandId, EditorEvent } from '../config/enum';
import type {
  LayoutRectangle,
  NativeSyntheticEvent,
  PlatformOSType,
} from 'react-native';

export type DocumentCommandId = ValueOf<typeof DocumentCommandId>;
export type HTMLElementTag = keyof HTMLElementTagNameMap;
export type EditorEvent = ValueOf<typeof EditorEvent>;
export type ValueOf<T extends object> = T[keyof T];

export interface ExtendedWebView extends WebView {
  focus: () => void;
  dispatch: (action: Action) => void;
}

export type DocumentCommandConstructor<
  T extends DocumentCommand = DocumentCommand
> = new (editor: HTMLElement) => T;

export type ActionMeta = {
  focusable?: boolean;
  selectable?: boolean;
};

export type Action<
  P = { toString: () => string },
  M extends ActionMeta = ActionMeta
> = {
  type: DocumentCommandId | (string & {});
  payload?: P;
  meta?: M;
};

export type ActionCreator<P, M extends ActionMeta = ActionMeta> = (
  payload?: P,
  meta?: M
) => Action<P, M>;

export type HTMLElementInfo = {
  tagName: Uppercase<HTMLElementTag>;
} & {
  [P in keyof React.AllHTMLAttributes<unknown>]?: string;
} & LayoutRectangle;

export type CommandsInfo = Record<
  DocumentCommandId | (string & {}),
  {
    state: string | boolean;
    enabled: boolean;
  }
>;

export type Event<T> = Pick<
  NativeSyntheticEvent<T>,
  'type' | 'timeStamp' | 'nativeEvent'
>;

export type EventData = {
  [EditorEvent.BLUR]: { text: string };
  [EditorEvent.FOCUS]: { text: string };
  [EditorEvent.CHANGE]: { text: string };
  [EditorEvent.KEY_DOWN]: { key: string };
  [EditorEvent.KEY_UP]: { key: string };
  [EditorEvent.SELECT]: { data: CommandsInfo };
  [EditorEvent.PASTE]: { text: string };
  [EditorEvent.INPUT]: Pick<InputEvent, 'inputType' | 'data'>;
  [EditorEvent.PRESS]: HTMLElementInfo;
};

export interface EditorTransferObject {
  listeners: Record<EditorEvent, boolean>;
  commands: string[];
  extraCommands: string[];
  platform: PlatformOSType;
}

export type EventMessage<T extends EditorEvent> = {
  type: T;
  payload: EventData[T];
};
