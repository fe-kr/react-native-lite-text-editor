import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { StyleSheet } from 'react-native';
import {
  type WebView as NativeWebView,
  type WebViewMessageEvent,
  type WebViewProps,
} from 'react-native-webview';

const WebView = forwardRef<NativeWebView, WebViewProps>(
  (
    {
      source,
      testID,
      injectedJavaScript,
      injectedJavaScriptBeforeContentLoaded,
      injectedJavaScriptObject,
      onLoad,
      onMessage,
      scrollEnabled,
      containerStyle,
    },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const styleObj = StyleSheet.flatten(containerStyle);

    const srcDoc = useMemo(() => {
      if (!source || !('html' in source)) {
        return;
      }

      const document = new DOMParser().parseFromString(
        source.html,
        'text/html'
      );

      document.head.appendChild(
        createScript(
          getDefaultInjectedJavaScript(injectedJavaScriptObject),
          injectedJavaScriptBeforeContentLoaded
        )
      );

      if (injectedJavaScript) {
        document.body.appendChild(createScript(injectedJavaScript));
      }

      return document.documentElement.outerHTML;
    }, [
      injectedJavaScript,
      injectedJavaScriptBeforeContentLoaded,
      injectedJavaScriptObject,
      source,
    ]);

    useImperativeHandle(ref, () => {
      const { contentWindow } = iframeRef.current ?? {};

      return {
        goBack: () => contentWindow?.history.back(),
        goForward: () => contentWindow?.history.forward(),
        reload: () => contentWindow?.location.reload(),
        stopLoading: () => contentWindow?.stop(),
        postMessage: (message: string) => contentWindow?.postMessage(message),
        requestFocus: () => contentWindow?.focus(),
        injectJavaScript: noop,
        forceUpdate: noop,
        clearCache: noop,
        clearHistory: noop,
        clearFormData: noop,
      } as unknown as NativeWebView;
    });

    useEffect(() => {
      const listener = (e: Partial<MessageEvent<string>>) => {
        onMessage?.({ nativeEvent: e } as WebViewMessageEvent);
      };

      window.addEventListener('message', listener, true);

      return () => {
        window.removeEventListener('message', listener, true);
      };
    }, [onMessage]);

    return (
      <iframe
        allowFullScreen
        seamless
        ref={iframeRef}
        data-testid={testID}
        srcDoc={srcDoc}
        width={styleObj?.width?.toString()}
        height={styleObj?.height?.toString()}
        style={StyleSheet.flatten<any>([
          styles.iframe,
          !scrollEnabled && styles.overflowHidden,
          styleObj,
        ])}
        onLoad={onLoad as unknown as React.ReactEventHandler<HTMLIFrameElement>}
      />
    );
  }
);

const noop = () => {};

const getDefaultInjectedJavaScript = <T extends object>(
  jsObject?: T
) => `window.ReactNativeWebView = { 
    postMessage: (...args) => window.parent.postMessage(...args),
    injectedObjectJson: () => ${JSON.stringify(
      JSON.stringify(jsObject ?? null)
    )},
  };`;

const createScript = (...args: (string | undefined)[]) => {
  const script = document.createElement('script');

  script.textContent = args.filter(Boolean).join('\n');

  return script;
};

const styles = StyleSheet.create({
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  overflowHidden: {
    overflow: 'hidden',
  },
});

export default WebView;
