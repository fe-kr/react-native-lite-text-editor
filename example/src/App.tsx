import { useRef, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  TextEditor,
  Toolbar,
  type ToolbarProps,
  type CommandsInfo,
  type ExtendedWebView,
} from 'react-native-lite-text-editor';
import { dropdownIconProps, fontKey, toolbarConfig } from './config';
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { useFonts } from 'expo-font';

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
        Icon={MaterialIcons as ToolbarProps['Icon']}
        dropdownIconProps={dropdownIconProps}
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
});
