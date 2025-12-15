import {
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  View,
  type PressableStateCallbackType,
  Pressable,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { useToolbarStyle } from './toolbar-style-provider';
import { useCallback } from 'react';

export interface ToolbarItemProps extends PressableProps {
  id: string;
  type: 'icon' | 'text' | 'color';
  title?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
  innerProps?: TextProps | ViewProps;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ToolbarItem = ({
  type,
  selected,
  name,
  containerStyle,
  value,
  style,
  disabled,
  children,
  innerProps,
  ...props
}: ToolbarItemProps) => {
  const { Icon, theme } = useToolbarStyle();

  const color = selected
    ? theme.palette.selectedTintColor
    : theme.palette.tintColor;
  const borderColor = selected ? theme.palette.selectedTintColor : undefined;
  const { size } = theme.components.Icon ?? {};

  const createStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      pressed && !disabled && { opacity: theme.palette.activeOpacity },
      disabled && { opacity: theme.palette.disabledOpacity },
      styles.container,
      ...(type === 'color' ? [styles.colorContainer, { borderColor }] : []),
      containerStyle,
    ],
    [
      disabled,
      theme.palette.activeOpacity,
      theme.palette.disabledOpacity,
      type,
      borderColor,
      containerStyle,
    ]
  );

  return (
    <Pressable {...props} disabled={disabled} style={createStyle}>
      {type === 'icon' && !!value && (
        <Icon
          {...(innerProps as object)}
          size={size}
          name={value}
          color={color}
        />
      )}

      {type === 'color' && (
        <View
          {...(innerProps as object)}
          style={[
            {
              width: size,
              height: size,
              backgroundColor: value,
            },
            style,
          ]}
        />
      )}

      {type === 'text' && (
        <Text {...(innerProps as object)} style={[{ color }, style]}>
          {name}
        </Text>
      )}

      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  colorContainer: {
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 1,
  },
});
