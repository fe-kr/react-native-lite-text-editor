import { useRef, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  TextEditor,
  Toolbar,
  type ToolbarProps,
  type CommandsInfo,
  type ExtendedWebView,
} from 'react-native-lite-text-editor';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useFonts } from 'expo-font';
import { createConfig } from './config/toolbar';

export default function App() {
  const editorRef = useRef<ExtendedWebView>(null!);
  const [state, setState] = useState<CommandsInfo>(null!);

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
    <SafeAreaView style={styles.container}>
      <TextEditor
        initialSelect
        ref={editorRef}
        containerStyle={styles.container}
        onSelectionChange={(e) => setState(e.nativeEvent.data)}
        placeholder="Type text here..."
        content="<b>Hello World</b>"
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
    </SafeAreaView>
  );
}

const Separator = () => <View style={styles.separator} />;
const Icon = MaterialIcons as ToolbarProps['Icon'];

const toolbarConfig = createConfig();

const fontKey = Platform.select({
  web: 'MaterialIcons-Regular',
  default: 'MaterialIcons',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#ccced1',
    margin: 4,
  },
  toolbar: {
    padding: 8,
    maxHeight: 56,
    backgroundColor: '#eee',
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
