import type { EditorEvent, Event, EventData, EventMessage } from '../../types';

export const createEvent = <T extends EditorEvent>(
  action: EventMessage<EditorEvent>
) =>
  ({
    type: action.type,
    timeStamp: Date.now(),
    nativeEvent: action.payload,
  } as Event<EventData[T]>);

export const logger = `(payload) => {
    if (!${__DEV__}) return;
    const message = JSON.stringify({ type: 'log', payload });
    window.ReactNativeWebView?.postMessage(message);
  }`;

export const isActionLike = <T>(value: unknown): value is T => {
  return (
    !!value &&
    typeof value === 'object' &&
    'type' in value &&
    typeof value.type === 'string'
  );
};

export class GlobalVars<T extends object> {
  private base: string;
  private strings: string[];

  constructor(private name: string) {
    this.base = `window.${this.name}`;
    this.strings = [`${this.base} = {}`];
  }

  set(key: keyof T, value: string) {
    this.strings.push(`${this.base}.${key as string} = ${value}`);

    return this;
  }

  build(...extras: string[]) {
    return this.strings.concat(extras).join(';');
  }
}
