import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface ColorProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Color = ({ size, containerStyle, style, color }: ColorProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.main,
          { width: size, height: size, backgroundColor: color },
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 1,
  },
  main: {
    shadowColor: '#ccced1',
    shadowRadius: 5,
    elevation: 5,
  },
});
