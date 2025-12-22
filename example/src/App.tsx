import { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import {
  TextEditor,
  Toolbar,
  type ToolbarProps,
  type CommandsInfo,
  type ExtendedWebView,
  type Event,
  type EventData,
} from 'react-native-lite-text-editor';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useFonts } from 'expo-font';
import { defaultStyles } from './config/styles';
import { content } from './config/content';
import { createConfig } from './config/toolbar';
import type { WebViewMessageEvent } from 'react-native-webview';
import extraCommands from '../generated/commands';
import { ToolbarItem } from './components/toolbar-item';

export default function App() {
  const editorRef = useRef<ExtendedWebView>(null!);
  const [state, setState] = useState<CommandsInfo>(null!);

  const logger = useCallback(
    (data: unknown, level: 'log' | 'warn' | 'error' = 'log') => {
      if (__DEV__) console[level](data);
    },
    []
  );

  const onSelectionChange = useCallback(
    (e: Event<EventData['select']>) => {
      logger(e);

      setState(e.nativeEvent.data);
    },
    [logger]
  );

  const onElementPress = useCallback(
    (e: Event<EventData['press']>) => {
      logger(e);

      if (e.nativeEvent.tagName === 'A' && e.nativeEvent.href) {
        Linking.openURL(e.nativeEvent.href);
      }
    },
    [logger]
  );

  const onMessage = useCallback(
    (e: WebViewMessageEvent) => {
      logger(JSON.parse(e.nativeEvent.data));
    },
    [logger]
  );

  const [isLoading] = useFonts({
    [fontKey]: require('@react-native-vector-icons/material-icons/fonts/MaterialIcons.ttf'),
  });

  if (!isLoading) {
    return (
      <View style={styles.progress}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TextEditor
        autoSelect
        webviewDebuggingEnabled={__DEV__}
        ref={editorRef}
        containerStyle={styles.container}
        placeholder="Type text here..."
        defaultStyles={defaultStyles}
        onSelectionChange={onSelectionChange}
        onPress={onElementPress}
        onLongPress={logger}
        extraCommands={extraCommands}
        onPaste={logger}
        onBlur={logger}
        onFocus={logger}
        onChange={logger}
        onMessage={onMessage}
        content={content}
      />

      <Toolbar
        horizontal
        editorRef={editorRef}
        data={state}
        theme={theme}
        config={toolbarConfig}
        style={styles.toolbar}
        Icon={MaterialIcons as ToolbarProps['Icon']}
        Item={ToolbarItem}
        ItemSeparatorComponent={ToolbarSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: 1,
    backgroundColor: '#ccced1',
    margin: 8,
  },
  toolbar: {
    paddingHorizontal: 16,
    height: '100%',
    maxHeight: 48,
    borderColor: '#ccced1',
    borderWidth: 1,
    borderTopWidth: 0,
  },
  popover: {
    backgroundColor: '#ffffff',
    shadowColor: '#ccced1',
    shadowRadius: 5,
    elevation: 5,
    padding: 4,
  },
});

const toolbarConfig = createConfig();

const theme: ToolbarProps['theme'] = {
  components: {
    Icon: {
      size: 20,
    },
    Popover: {
      containerStyle: styles.popover,
    },
  },
};

const fontKey = Platform.select({
  web: 'MaterialIcons-Regular',
  default: 'MaterialIcons',
});

const ToolbarSeparator = () => <View style={styles.separator} />;
