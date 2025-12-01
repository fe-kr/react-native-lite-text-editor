import { debounce } from './web-editor.lib';
import { EditorEvent } from '../../config/enum';

import { EditorService } from './web-editor.service';
import type {
  Action,
  EditorEvent as EditorEventType,
  EditorTransferObject,
  EventData,
} from '../../types';

class EditorModule {
  view: HTMLElement;
  service: EditorService;

  constructor(private options: EditorTransferObject) {
    this.view = document.querySelector('#rnlte-root')!;

    this.service = new EditorService(this.view, this.options);

    this.addListeners();
  }

  addListeners = () => {
    Object.entries({
      [EditorEvent.BLUR]: this.onBlur,
      [EditorEvent.FOCUS]: this.onFocus,
      [EditorEvent.PASTE]: this.onPaste,
      [EditorEvent.INPUT]: this.onInput,
      [EditorEvent.KEY_UP]: this.onKeyUp,
      [EditorEvent.KEY_DOWN]: this.onKeyDown,
    } as const).forEach(([type, callback]) => {
      if (!this.options?.listeners[type as EditorEventType]) return;

      this.view.addEventListener(type, callback as EventListener);
    });

    if (this.options.listeners[EditorEvent.SELECT]) {
      this.view.addEventListener('keydown', this.onSelect);
      this.view.addEventListener('touchcancel', this.onSelect);
      this.view.addEventListener('touchend', this.onSelect);
      this.view.addEventListener('mouseup', this.onSelect);
      this.view.addEventListener('keyup', (e) => {
        if (e.key === 'Backspace') this.onSelect();
      });
    }

    if (this.options.listeners[EditorEvent.PRESS]) {
      this.view.addEventListener('click', this.onPress);
    }

    this.view.addEventListener('input', () => {
      if (this.view.innerHTML === '<br>') this.view.innerHTML = '';
      if (this.options.listeners[EditorEvent.CHANGE]) this.onChange();
    });

    (this.options.platform === 'android' ? document : window).addEventListener(
      'message',
      this.onMessage as EventListener
    );
  };

  postMessage = <T extends EditorEventType>(type: T, payload: EventData[T]) => {
    if (!('ReactNativeWebView' in window)) return;

    const message = JSON.stringify({ type, payload });

    (window.ReactNativeWebView as Window).postMessage(message);
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

export default function main(globalVars: EditorTransferObject) {
  return new EditorModule(globalVars);
}
