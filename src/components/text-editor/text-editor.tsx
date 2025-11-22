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
  DocumentCommandConstructor,
  DocumentCommandId,
  EditorEvent as EditorEventType,
  Event,
  EventData,
  EventMessage,
  ExtendedWebView,
} from '../../types';
import {
  Platform,
  TextInput,
  type TextInputProps,
  StyleSheet,
  type NativeSyntheticEvent,
} from 'react-native';
import createHtml from '../web-editor';
import { EditorEvent } from '../../config/enum';
import type {
  WebViewMessageEvent,
  WebViewNavigation,
  WebViewProps,
} from 'react-native-webview';
import { createEvent, isActionLike } from './text-editor.lib';

export interface TextEditorProps extends WebViewProps {
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: 'on' | 'off';
  autoFocus?: boolean;
  contentEditable?: boolean;
  initialSelect?: boolean;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  placeholder?: string;
  content?: string;
  commands?: DocumentCommandId[];
  extraCommands?: DocumentCommandConstructor[];
  styles?: string;
  defaultStyles?: string;
  onEditorBlur?: (e: Event<EventData['blur']>) => void;
  onEditorFocus?: (e: Event<EventData['focus']>) => void;
  onChange?: (e: Event<EventData['change']>) => void;
  onInput?: (e: Event<EventData['input']>) => void;
  onPress?: (e: Event<EventData['press']>) => void;
  onKeyDown?: (e: Event<EventData['keyDown']>) => void;
  onKeyUp?: (e: Event<EventData['keyUp']>) => void;
  onPaste?: (e: Event<EventData['paste']>) => void;
  onSelectionChange?: (e: Event<EventData['select']>) => void;
}

export const TextEditor = forwardRef<ExtendedWebView, TextEditorProps>(
  (
    {
      autoFocus = false,
      autoCapitalize = 'none',
      contentEditable = true,
      autoCorrect = 'off',
      placeholder = '',
      enterKeyHint = 'enter',
      content = '',
      initialSelect = false,
      source,
      defaultStyles,
      styles,
      onSelectionChange,
      onEditorBlur: onBlur,
      onChange,
      onEditorFocus: onFocus,
      onKeyDown,
      onKeyUp,
      onPaste,
      onPress,
      onInput,
      onLoad,
      onLoadStart,
      onMessage,
      commands = ['*'],
      extraCommands = [],
      injectedJavaScriptObject,
      injectedJavaScriptBeforeContentLoaded = 'void 0;',
      ...webViewProps
    },
    outerRef
  ) => {
    const readyRef = useRef(false);
    const ref = useRef<React.ComponentRef<typeof WebView>>(null);
    const inputRef = useRef<React.ComponentRef<TextInput> | null>(null);

    const [webViewSource] = useState(() => ({
      html: createHtml({ styles, defaultStyles, content }),
      ...source,
    }));

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

    const injectedJSObject = useMemo(
      () => ({
        ...injectedJavaScriptObject,
        platform: Platform.OS,
        commands: commands,
        extraCommands: extraCommands.map((command) => command.toString()),
        listeners: {
          [EditorEvent.BLUR]: !!onBlur,
          [EditorEvent.CHANGE]: !!onChange,
          [EditorEvent.FOCUS]: !!onFocus,
          [EditorEvent.INPUT]: !!onInput,
          [EditorEvent.KEY_DOWN]: !!onKeyDown,
          [EditorEvent.KEY_UP]: !onKeyUp,
          [EditorEvent.PASTE]: !!onPaste,
          [EditorEvent.PRESS]: !!onPress,
          [EditorEvent.SELECT]: !!onSelectionChange,
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [readyRef.current]
    );

    const isReady = useCallback(() => readyRef.current, []);

    const dispatch = useCallback((data: Action) => {
      const message = JSON.stringify(data);

      ref.current?.postMessage(message);
    }, []);

    const focusEditor = useCallback(() => {
      if (Platform.OS === 'android') {
        inputRef.current?.focus();
      }

      ref.current?.requestFocus();

      dispatch(focus);
    }, [dispatch]);

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

        if (autoFocus && contentEditable) focusEditor();

        if (initialSelect) dispatch(select);

        onLoad?.(e);
      },
      [
        dispatch,
        attributes,
        autoFocus,
        contentEditable,
        focusEditor,
        initialSelect,
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
              onKeyDown?.(createEvent<'keyDown'>(action));
              break;
            }

            case EditorEvent.KEY_UP: {
              onKeyUp?.(createEvent<'keyUp'>(action));
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
      <>
        <WebView
          {...defaultProps}
          {...webViewProps}
          ref={ref}
          injectedJavaScriptObject={injectedJSObject}
          injectedJavaScriptBeforeContentLoaded={
            injectedJavaScriptBeforeContentLoaded
          }
          source={webViewSource}
          onLoad={onWebViewLoad}
          onLoadStart={onWebViewLoadStart}
          onMessage={onWebViewMessage}
        />

        {Platform.OS === 'android' && (
          <TextInput ref={inputRef} style={innerStyles.input} />
        )}
      </>
    );
  }
);

const innerStyles = StyleSheet.create({
  input: {
    position: 'absolute',
    width: 1,
    height: 1,
    zIndex: -999,
    bottom: -999,
    left: -999,
  },
  webView: {
    backgroundColor: 'transparent',
  },
});

const defaultProps = {
  originWhitelist: ['*'],
  style: innerStyles.webView,
};
