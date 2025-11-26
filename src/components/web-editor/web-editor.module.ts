import { debounce, postMessage } from './web-editor.lib';
import { EditorEvent } from '../../config/enum';

import { EditorService } from './web-editor.service';
import type {
  Action,
  EditorEvent as EditorEventType,
  EditorTransferObject,
  EventData,
} from '../../types';

export default class EditorModule {
  view: HTMLElement;
  service: EditorService;

  constructor() {
    this.view = document.querySelector('#rnlte-root')!;

    const options = this.injectedObjectJson();

    this.service = new EditorService(this.view, options);

    this.addListeners(options);
  }

  addListeners = (options: EditorTransferObject | null) => {
    Object.entries({
      [EditorEvent.BLUR]: ['blur', this.onBlur],
      [EditorEvent.FOCUS]: ['focus', this.onFocus],
      [EditorEvent.PASTE]: ['paste', this.onPaste],
      [EditorEvent.INPUT]: ['input', this.onInput],
      [EditorEvent.PRESS]: ['click', this.onPress],
      [EditorEvent.KEY_UP]: ['keyup', this.onKeyUp],
      [EditorEvent.KEY_DOWN]: ['keydown', this.onKeyDown],
    } as const).forEach(([key, args]) => {
      if (!options?.listeners[key as EditorEventType]) return;

      const [type, callback] = args;

      this.view.addEventListener(type, callback as EventListener);
    });

    if (options?.listeners[EditorEvent.SELECT]) {
      this.view.addEventListener('keydown', this.onSelect);
      this.view.addEventListener('touchcancel', this.onSelect);
      this.view.addEventListener('touchend', this.onSelect);
      this.view.addEventListener('mouseup', this.onSelect);
      this.view.addEventListener('keyup', (e) => {
        if (e.key === 'Backspace') this.onSelect();
      });
    }

    this.view.addEventListener('input', () => {
      if (this.view.innerHTML === '<br>') this.view.innerHTML = '';
      if (options?.listeners[EditorEvent.CHANGE]) this.onChange();
    });

    (window.RNLTE.platformOS === 'android'
      ? document
      : window
    ).addEventListener('message', this.onMessage as EventListener);
  };

  injectedObjectJson = (): EditorTransferObject | null => {
    try {
      const injectedJson = window.ReactNativeWebView?.injectedObjectJson();

      return JSON.parse(injectedJson ?? null!);
    } catch {
      return null;
    }
  };

  postMessage = <T extends EditorEventType>(type: T, payload: EventData[T]) => {
    postMessage(type, payload);
  };

  parseMessage = (message: string): Action | null => {
    try {
      const data = JSON.parse(message);

      return data && typeof data === 'object' ? data : null;
    } catch {
      return null;
    }
  };

  onInput = (_e: Event) => {
    const { inputType, data } = _e as InputEvent;

    this.postMessage(EditorEvent.INPUT, { inputType, data });
  };

  onChange = debounce(() => {
    this.postMessage(EditorEvent.CHANGE, { text: this.view.innerHTML });
  }, 50);

  onFocus = () => {
    this.postMessage(EditorEvent.FOCUS, { text: this.view.innerHTML });
  };

  onBlur = () => {
    this.postMessage(EditorEvent.BLUR, { text: this.view.innerHTML });
  };

  onKeyDown = (e: KeyboardEvent) => {
    this.postMessage(EditorEvent.KEY_DOWN, { key: e.key });
  };

  onKeyUp = (e: KeyboardEvent) => {
    this.postMessage(EditorEvent.KEY_UP, { key: e.key });
  };

  onPaste = (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData('text/plain') ?? '';

    this.postMessage(EditorEvent.PASTE, { text });
  };

  onSelect = debounce(() => {
    const data = this.service.queryCommands();

    this.postMessage(EditorEvent.SELECT, { data });
  }, 50);

  onPress = (e: PointerEvent) => {
    const attributes = this.service.getElementAttributes(e);

    if (attributes) this.postMessage(EditorEvent.PRESS, attributes);
  };

  onMessage = (e: MessageEvent) => {
    const message = this.parseMessage(e.data);

    if (!message) return;

    const { type, payload, meta } = message;

    if (meta?.focusable) this.view.focus();

    this.service.commands.get(type)?.exec(payload);

    if (meta?.selectable) this.onSelect();
  };
}
