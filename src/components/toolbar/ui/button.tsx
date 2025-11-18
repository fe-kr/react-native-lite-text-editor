import { useCallback } from 'react';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface ButtonProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  disabledOpacity?: number;
  children?: React.ReactNode;
}

export const Button = ({
  style,
  activeOpacity = 0.75,
  disabledOpacity = 0.25,
  disabled,
  ...props
}: ButtonProps) => {
  const createStyle = useCallback(
    ({ pressed }: PressableStateCallbackType) => [
      pressed && !disabled && { opacity: activeOpacity },
      disabled && { opacity: disabledOpacity },
      style,
    ],
    [activeOpacity, disabled, disabledOpacity, style]
  );

  return <Pressable {...props} disabled={disabled} style={createStyle} />;
};
