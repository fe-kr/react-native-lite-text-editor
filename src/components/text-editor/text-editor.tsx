import WebView from '../web-view';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  setAttribute,
  focus as focusAction,
  select,
  insertStyle,
} from '../../config/actions';
import type {
  Action,
  Callback,
  DocumentCommandId,
  EditorEvent as EditorEventType,
  EditorTransferObject,
  Event,
  EventData,
  EventMessage,
  ExtendedWebView,
} from '../../types';
import {
  Platform,
  type TextInputProps,
  type NativeSyntheticEvent,
  View,
} from 'react-native';
import createHtml from '../web-editor';
import { EditorEvent } from '../../config/enum';
import type {
  WebViewMessageEvent,
  WebViewNavigation,
  WebViewProps,
} from 'react-native-webview';
import { Container } from './text-editor-container';

export interface TextEditorProps
  extends Omit<WebViewProps, 'onBlur' | 'onFocus'> {
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: 'on' | 'off';
  autoFocus?: 'start' | 'end';
  contentEditable?: boolean;
  autoSelect?: boolean;
  delayLongPress?: number;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  placeholder?: string;
  content?: string;
  commands?: DocumentCommandId[];
  extraCommands?: string[];
  styles?: string;
  defaultStyles?: string;
  onBlur?: (e: Event<EventData['blur']>) => void;
  onFocus?: (e: Event<EventData['focus']>) => void;
  onChange?: (e: Event<EventData['change']>) => void;
  onInput?: (e: Event<EventData['input']>) => void;
  onPress?: (e: Event<EventData['press']>) => void;
  onLongPress?: (e: Event<EventData['longPress']>) => void;
  onKeyDown?: (e: Event<EventData['keydown']>) => void;
  onKeyUp?: (e: Event<EventData['keyup']>) => void;
  onPaste?: (e: Event<EventData['paste']>) => void;
  onSelectionChange?: (e: Event<EventData['select']>) => void;
}

export const TextEditor = forwardRef<ExtendedWebView, TextEditorProps>(
  (props, outerRef) => {
    const {
      autoFocus,
      autoCapitalize,
      contentEditable,
      autoCorrect,
      placeholder,
      enterKeyHint,
      delayLongPress,
      content,
      autoSelect,
      source,
      defaultStyles,
      styles,
      onSelectionChange,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onKeyUp,
      onPaste,
      onPress,
      onLongPress,
      onInput,
      onLoad,
      onLoadStart,
      onMessage,
      commands,
      extraCommands,
      ...webViewProps
    } = { ...defaultProps, ...props };

    const readyRef = useRef(false);
    const ref = useRef<React.ComponentRef<typeof WebView>>(null);
    const containerRef = useRef<React.ComponentRef<typeof View>>(null);

    const [webViewSource] = useState(() => {
      const globalVars = stringifyObject(
        {
          platform: Platform.OS,
          commands,
          delayLongPress,
          extraCommands,
          listeners: {
            [EditorEvent.BLUR]: !!onBlur,
            [EditorEvent.CHANGE]: !!onChange,
            [EditorEvent.FOCUS]: !!onFocus,
            [EditorEvent.INPUT]: !!onInput,
            [EditorEvent.KEY_DOWN]: !!onKeyDown,
            [EditorEvent.KEY_UP]: !!onKeyUp,
            [EditorEvent.PASTE]: !!onPaste,
            [EditorEvent.PRESS]: !!onPress,
            [EditorEvent.LONG_PRESS]: !!onLongPress,
            [EditorEvent.SELECT]: !!onSelectionChange,
          },
        } satisfies EditorTransferObject,
        (key, value) =>
          key === 'extraCommands' ? `[${value}]` : JSON.stringify(value)
      );

      return {
        html: createHtml({ styles, defaultStyles, globalVars, content }),
        ...source,
      };
    });

    const attributes = useMemo(
      () => ({
        placeholder,
        contentEditable,
        autoCapitalize,
        autoCorrect,
        enterKeyHint,
      }),
      [autoCapitalize, autoCorrect, contentEditable, enterKeyHint, placeholder]
    );

    const dispatch = useCallback((data: Action) => {
      const message = JSON.stringify(data);

      ref.current?.postMessage(message);
    }, []);

    const focus = useCallback(
      (position?: 'start' | 'end') => {
        containerRef.current?.focus();

        ref.current?.requestFocus();

        dispatch(focusAction(position!));
      },
      [dispatch]
    );

    const onWebViewLoadStart = useCallback(
      (e: NativeSyntheticEvent<WebViewNavigation>) => {
        readyRef.current = false;

        onLoadStart?.(e);
      },
      [onLoadStart]
    );

    const onWebViewLoad = useCallback(
      (e: NativeSyntheticEvent<WebViewNavigation>) => {
        readyRef.current = true;

        dispatch(setAttribute(attributes));

        if (contentEditable) {
          if (autoFocus) {
            focus(autoFocus);
          }

          if (autoSelect) {
            dispatch(select);
          }
        }

        onLoad?.(e);
      },
      [
        dispatch,
        attributes,
        autoFocus,
        contentEditable,
        focus,
        autoSelect,
        onLoad,
      ]
    );

    const onWebViewMessage = useCallback(
      (e: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(e.nativeEvent.data);

          if (!(data && typeof data === 'object' && 'type' in data)) {
            onMessage?.(e);
            return;
          }

          const action = data as EventMessage<EditorEventType>;

          switch (action.type) {
            case EditorEvent.SELECT: {
              onSelectionChange?.(createEvent<'select'>(action));
              break;
            }

            case EditorEvent.BLUR: {
              onBlur?.(createEvent<'blur'>(action));
              break;
            }

            case EditorEvent.CHANGE: {
              onChange?.(createEvent<'change'>(action));
              break;
            }

            case EditorEvent.FOCUS: {
              onFocus?.(createEvent<'focus'>(action));
              break;
            }

            case EditorEvent.KEY_DOWN: {
              onKeyDown?.(createEvent<'keydown'>(action));
              break;
            }

            case EditorEvent.KEY_UP: {
              onKeyUp?.(createEvent<'keyup'>(action));
              break;
            }

            case EditorEvent.PASTE: {
              onPaste?.(createEvent<'paste'>(action));
              break;
            }

            case EditorEvent.PRESS: {
              onPress?.(createEvent<'press'>(action));
              break;
            }

            case EditorEvent.LONG_PRESS: {
              onLongPress?.(createEvent<'longPress'>(action));
              break;
            }

            case EditorEvent.INPUT: {
              onInput?.(createEvent<'input'>(action));
              break;
            }

            default: {
              onMessage?.(e);
              break;
            }
          }
        } catch {
          onMessage?.(e);
        }
      },
      [
        onMessage,
        onSelectionChange,
        onBlur,
        onChange,
        onFocus,
        onKeyDown,
        onKeyUp,
        onPaste,
        onPress,
        onLongPress,
        onInput,
      ]
    );

    useImperativeHandle(
      outerRef,
      () => ({ ...ref.current, dispatch, focus } as ExtendedWebView),
      [dispatch, focus]
    );

    useEffect(() => {
      if (!readyRef.current) return;

      dispatch(insertStyle(styles!));
    }, [dispatch, styles]);

    useEffect(() => {
      if (!readyRef.current) return;

      dispatch(setAttribute(attributes));
    }, [dispatch, attributes]);

    useEffect(() => {
      if (!readyRef.current) return;

      dispatch(setAttribute({ innerHTML: content }));
    }, [dispatch, content]);

    return (
      <Container ref={containerRef}>
        <WebView
          {...webViewProps}
          ref={ref}
          source={webViewSource}
          onLoad={onWebViewLoad}
          onLoadStart={onWebViewLoadStart}
          onMessage={onWebViewMessage}
        />
      </Container>
    );
  }
);

const createEvent = <T extends EditorEventType>(e: EventMessage<any>) =>
  ({
    type: e.type,
    timeStamp: Date.now(),
    nativeEvent: e.payload,
  } as Event<EventData[T]>);

const stringifyObject = <T extends object, C extends Callback>(
  data: T,
  callback: C
) =>
  `{${Object.entries(data).reduce(
    (acc, [key, value]) => acc.concat(`${key}: ${callback(key, value)},`),
    ''
  )}}`;

const defaultProps = {
  // Editor
  autoCapitalize: 'none',
  contentEditable: true,
  autoCorrect: 'off',
  delayLongPress: 500,
  placeholder: '',
  enterKeyHint: 'enter',
  content: '',
  styles: '',
  defaultStyles: '',
  autoSelect: false,
  commands: [],
  extraCommands: [],

  // WebView
  originWhitelist: ['*'],
  javaScriptEnabled: true,
  injectedJavaScriptBeforeContentLoaded: 'void 0;',
  style: { backgroundColor: 'transparent' },
} satisfies TextEditorProps;
