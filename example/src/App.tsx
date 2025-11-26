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
import { injectedJsBeforeContentLoaded } from './config/scripts';
import type { WebViewMessageEvent } from 'react-native-webview';

export default function App() {
  const editorRef = useRef<ExtendedWebView>(null!);
  const [state, setState] = useState<CommandsInfo>(null!);

  const onSelectionChange = useCallback((e: Event<EventData['select']>) => {
    logger(e);

    setState(e.nativeEvent.data);
  }, []);

  const onElementPress = useCallback((e: Event<EventData['press']>) => {
    logger(e);

    if (e.nativeEvent.tagName === 'A' && e.nativeEvent.href) {
      Linking.openURL(e.nativeEvent.href);
    }
  }, []);

  const onMessage = useCallback((e: WebViewMessageEvent) => {
    logger(JSON.parse(e.nativeEvent.data));
  }, []);

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
        initialSelect
        autoFocus
        ref={editorRef}
        containerStyle={styles.container}
        placeholder="Type text here..."
        defaultStyles={defaultStyles}
        onSelectionChange={onSelectionChange}
        onPress={onElementPress}
        injectedJavaScriptBeforeContentLoaded={injectedJsBeforeContentLoaded}
        onPaste={logger}
        onBlur={logger}
        onFocus={logger}
        onChange={logger}
        onMessage={onMessage}
        content={content}
      />

      <Toolbar
        horizontal
        Icon={Icon}
        dropdownIconProps={dropdownIconProps}
        popoverProps={popoverProps}
        tooltipProps={tooltipProps}
        editorRef={editorRef}
        data={state}
        config={toolbarConfig}
        style={styles.toolbar}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
}

const Separator = () => <View style={styles.separator} />;
const Icon = MaterialIcons as ToolbarProps['Icon'];

const toolbarConfig = createConfig();

const logger = <T,>(data: T, level: 'log' | 'warn' | 'error' = 'log') => {
  if (__DEV__) console[level](data);
};

const fontKey = Platform.select({
  web: 'MaterialIcons-Regular',
  default: 'MaterialIcons',
});

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
  dropdownIcon: {
    marginLeft: 4,
  },
  tooltip: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  popoverContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#ccced1',
    shadowRadius: 5,
    elevation: 5,
  },
});

const dropdownIconProps: ToolbarProps['dropdownIconProps'] = {
  name: 'arrow-drop-down',
  style: styles.dropdownIcon,
};

const popoverProps: ToolbarProps['popoverProps'] = {
  containerStyle: styles.popoverContainer,
};

const tooltipProps: ToolbarProps['tooltipProps'] = {
  style: styles.tooltip,
};
