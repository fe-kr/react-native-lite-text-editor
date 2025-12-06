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
import { setAttribute, focus, select, insertStyle } from '../../config/actions';
import type {
  Action,
  DocumentCommandId,
  EditorEvent as EditorEventType,
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
import { createEvent, isActionLike, GlobalVars } from './text-editor-lib';
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
      const globalVars = new GlobalVars()
        .set('platform', Platform.OS)
        .set('commands', commands)
        .set('extraCommands', `[${extraCommands}]`, false)
        .set('delayLongPress', delayLongPress)
        .set('listeners', {
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
        })
        .build();

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

    const isReady = useCallback(() => readyRef.current, []);

    const dispatch = useCallback((data: Action) => {
      const message = JSON.stringify(data);

      ref.current?.postMessage(message);
    }, []);

    const focusEditor = useCallback(
      (position: 'start' | 'end') => {
        containerRef.current?.focus();

        ref.current?.requestFocus();

        dispatch(focus(position));
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

        if (autoFocus && contentEditable) focusEditor(autoFocus);

        if (autoSelect) dispatch(select);

        onLoad?.(e);
      },
      [
        dispatch,
        attributes,
        autoFocus,
        contentEditable,
        focusEditor,
        autoSelect,
        onLoad,
      ]
    );

    const onWebViewMessage = useCallback(
      (e: WebViewMessageEvent) => {
        try {
          const action = JSON.parse(e.nativeEvent.data);

          if (!isActionLike<EventMessage<EditorEventType>>(action)) {
            onMessage?.(e);
            return;
          }

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
        } catch {}
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
      () =>
        ({
          ...ref.current,
          dispatch,
          focus: focusEditor,
        } as ExtendedWebView),
      [dispatch, focusEditor]
    );

    useEffect(() => {
      if (!isReady()) return;

      dispatch(insertStyle(styles!));
    }, [dispatch, isReady, styles]);

    useEffect(() => {
      if (!isReady()) return;

      dispatch(setAttribute(attributes));
    }, [dispatch, isReady, attributes]);

    useEffect(() => {
      if (!isReady()) return;

      dispatch(setAttribute({ innerHTML: content }));
    }, [dispatch, isReady, content]);

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
