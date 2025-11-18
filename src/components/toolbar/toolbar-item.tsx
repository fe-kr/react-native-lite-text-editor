import {
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { Button, type ButtonProps } from './ui/button';
import { Color } from './ui/color';
import { useStyle } from './model/style-context';

export interface ToolbarItemProps extends ButtonProps {
  type?: 'icon' | 'text' | 'color';
  name?: string;
  value?: string;
  disabled?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle | TextStyle>;
  containerStyle?: ButtonProps['style'];
}

export const ToolbarItem = ({
  type,
  selected,
  name,
  containerStyle,
  value,
  style,
  children,
  ...props
}: ToolbarItemProps) => {
  const { Icon, iconSize: size, activeTintColor, tintColor } = useStyle();

  const color = selected ? activeTintColor : tintColor;
  const borderColor = selected ? activeTintColor : undefined;

  return (
    <Button {...props} style={[styles.container, containerStyle]}>
      {type === 'icon' && <Icon name={value!} size={size} color={color} />}

      {type === 'color' && (
        <Color
          style={style}
          color={value}
          size={size}
          containerStyle={{ borderColor }}
        />
      )}

      {type === 'text' && <Text style={[{ color }, style]}>{name}</Text>}

      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
