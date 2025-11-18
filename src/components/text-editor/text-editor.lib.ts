import type { EditorEvent, Event, EventData, EventMessage } from '../../types';

export const createEvent = <T extends EditorEvent>(
  action: EventMessage<EditorEvent>
) =>
  ({
    type: action.type,
    timeStamp: Date.now(),
    nativeEvent: action.payload,
  } as Event<EventData[T]>);
