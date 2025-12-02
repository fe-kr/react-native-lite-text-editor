import type { WebView } from 'react-native-webview';
import type { DocumentCommandId, EditorEvent } from './config/enum';
import type {
  LayoutRectangle,
  NativeSyntheticEvent,
  PlatformOSType,
} from 'react-native';

export type DocumentCommandId = ValueOf<typeof DocumentCommandId>;
export type HTMLElementTag = keyof HTMLElementTagNameMap;
export type EditorEvent = ValueOf<typeof EditorEvent>;
export type ValueOf<T extends object> = T[keyof T];
export type Callback = (...args: any[]) => void;
export type Constructor<T = any, P = any> = new (...args: P[]) => T;

export interface ExtendedWebView extends WebView {
  focus: Callback;
  dispatch: (action: Action) => void;
}

export type ActionMeta = {
  focusable?: boolean;
  selectable?: boolean;
  showKeyboard?: boolean;
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
  payload: P,
  meta?: M
) => Action<P, M>;

export type HTMLElementInfo = {
  tagName: Uppercase<HTMLElementTag>;
} & {
  [P in keyof React.AllHTMLAttributes<unknown>]?: string;
} & LayoutRectangle;

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
  [EditorEvent.LONG_PRESS]: HTMLElementInfo;
};

export interface DocumentCommand {
  id: string;
  queryState(): string | boolean;
  queryValue(): string;
  queryEnabled(): boolean;
  exec(value?: unknown): boolean;
}

export interface EditorTransferObject {
  platform: PlatformOSType;
  extraCommands: string[];
  commands: DocumentCommandId[];
  delayLongPress: number;
  listeners: Record<EditorEvent, boolean>;
}

export type CommandsInfo = Record<
  DocumentCommandId | (string & {}),
  {
    state: ReturnType<DocumentCommand['queryState']>;
    enabled: ReturnType<DocumentCommand['queryEnabled']>;
  }
>;

export type EventMessage<T extends EditorEvent> = {
  type: T;
  payload: EventData[T];
};
