import type { EditorEvent, Event, EventData, EventMessage } from '../../types';

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
