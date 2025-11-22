import {
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { Popover, type PopoverProps } from './popover';

export interface TooltipProps
  extends Omit<PopoverProps, 'anchor'>,
    Pick<TextProps, 'style' | 'numberOfLines' | 'ellipsizeMode'> {
  Component?: React.ComponentType<PopoverProps>;
  title?: string;
  style?: StyleProp<TextStyle>;
}

export const Tooltip = ({
  title,
  style,
  children,
  Component = Popover,
  numberOfLines,
  ellipsizeMode,
  ...props
}: TooltipProps) => {
  if (!title) {
    return children;
  }

  return (
    <Component {...props} anchor={children}>
      <Text
        style={style}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      >
        {title}
      </Text>
    </Component>
  );
};
