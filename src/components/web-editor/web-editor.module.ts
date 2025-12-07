import { EditorEvent } from '../../config/enum';

import { EditorService } from './web-editor.service';
import { EditorStorage } from './web-editor.storage';
import type {
  Action,
  Callback,
  EditorEvent as EditorEventType,
  EditorTransferObject,
  EventData,
} from '../../types';

class EditorModule {
  view: HTMLElement;
  service: EditorService;
  storage: EditorStorage;

  constructor(private options: EditorTransferObject) {
    this.view = document.querySelector('#rnlte-root')!;

    this.storage = new EditorStorage();

    this.service = new EditorService(this.view, this.storage, this.options);

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

    if (
      this.options.listeners[EditorEvent.PRESS] ||
      this.options.listeners[EditorEvent.LONG_PRESS]
    ) {
      this.view.addEventListener('pointerdown', this.onPointerDown);
      this.view.addEventListener('pointerup', this.onPointerUp);
      this.view.addEventListener('pointerleave', this.clearLongPressTimer);
      this.view.addEventListener('pointercancel', this.clearLongPressTimer);
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

  onPointerDown = (e: PointerEvent) => {
    if (this.options.listeners[EditorEvent.LONG_PRESS]) {
      const attributes = this.service.getElementAttributes(e);

      if (!attributes) return;

      const timerId = setTimeout(
        () => this.postMessage(EditorEvent.LONG_PRESS, attributes!),
        this.options.delayLongPress
      ) as unknown as number;

      this.storage.setItem('longPress', { timerId, timeStamp: e.timeStamp });
    }
  };

  onPointerUp = (e: PointerEvent) => {
    const { timeStamp = Date.now() } = this.storage.getItem('longPress') ?? {};

    const isLongPress =
      this.options.listeners[EditorEvent.LONG_PRESS] &&
      e.timeStamp - timeStamp >= this.options.delayLongPress;

    this.clearLongPressTimer();

    if (!isLongPress && this.options.listeners[EditorEvent.PRESS]) {
      const attributes = this.service.getElementAttributes(e);

      if (attributes) this.postMessage(EditorEvent.PRESS, attributes);
    }
  };

  clearLongPressTimer = () => {
    clearTimeout(this.storage.getItem('longPress')?.timerId);

    this.storage.removeItem('longPress');
  };

  onMessage = (e: MessageEvent) => {
    const message = this.parseMessage(e.data);

    if (!message) return;

    const { type, payload, meta } = message;

    if (meta?.focusable) this.view.focus();

    this.storage.getItem('commands')?.get(type)?.exec(payload);

    if (meta?.selectable) this.onSelect();
  };
}

const debounce = <F extends Callback>(func: F, wait: number) => {
  let timeoutId: number | null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(
      () => func.apply(this, args),
      wait
    ) as unknown as number;
  };
};

export default function main() {
  return new EditorModule(window.RNLTE);
}
