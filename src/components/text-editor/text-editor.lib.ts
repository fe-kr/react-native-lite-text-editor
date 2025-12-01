import type {
  EditorEvent,
  EditorTransferObject,
  Event,
  EventData,
  EventMessage,
} from '../../types';

export const createEvent = <T extends EditorEvent>(
  action: EventMessage<EditorEvent>
) =>
  ({
    type: action.type,
    timeStamp: Date.now(),
    nativeEvent: action.payload,
  } as Event<EventData[T]>);

export const isActionLike = <T>(value: unknown): value is T => {
  return (
    !!value &&
    typeof value === 'object' &&
    'type' in value &&
    typeof value.type === 'string'
  );
};

export class GlobalVars<K extends keyof EditorTransferObject & string> {
  private acc = '';

  set(key: K, value: unknown, toJSON: boolean = true) {
    this.acc += `${key}: ${toJSON ? JSON.stringify(value) : value},`;

    return this;
  }

  build() {
    return `window.RNLTE = {${this.acc}};`;
  }
}
