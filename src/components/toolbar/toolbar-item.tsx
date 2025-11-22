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
import { Tooltip } from './ui/tooltip';
import { useCallback, useState } from 'react';

export interface ToolbarItemProps extends ButtonProps {
  type?: 'icon' | 'text' | 'color';
  title?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  selected?: boolean;
  style?: StyleProp<ViewStyle | TextStyle>;
  containerStyle?: ButtonProps['style'];
}

export const ToolbarItem = ({
  type,
  title,
  selected,
  name,
  containerStyle,
  value,
  style,
  children,
  ...props
}: ToolbarItemProps) => {
  const {
    Icon,
    iconSize: size,
    Popover,
    tooltipProps,
    activeTintColor,
    tintColor,
  } = useStyle();
  const [isOpen, setIsOpen] = useState(false);

  const color = selected ? activeTintColor : tintColor;
  const borderColor = selected ? activeTintColor : undefined;

  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  return (
    <Tooltip
      {...tooltipProps}
      visible={isOpen}
      Component={Popover}
      onDismiss={onClose}
      title={title}
    >
      <Button
        {...props}
        onLongPress={onOpen}
        style={[styles.container, containerStyle]}
      >
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
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
