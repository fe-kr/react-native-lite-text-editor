import { View, StyleSheet } from 'react-native';
import { TextEditor } from 'react-native-lite-text-editor';

export default function App() {
  return (
    <View style={styles.container}>
      <TextEditor placeholder="Type text here..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
