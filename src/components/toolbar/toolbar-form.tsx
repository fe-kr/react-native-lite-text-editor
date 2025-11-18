import { useState } from 'react';
import {
  Pressable,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Action } from '../../types';
import { useStyle } from './model/style-context';

export interface ToolbarFormProps extends TextInputProps {
  iconName?: string;
  action?: (value: string) => Action;
  pattern?: RegExp;
  containerStyle?: StyleProp<ViewStyle>;
  onSubmit: (value: string) => void;
}

export const ToolbarForm = ({
  defaultValue,
  iconName,
  containerStyle,
  pattern,
  onSubmit,
  ...props
}: ToolbarFormProps) => {
  const { Icon, iconSize, tintColor, activeTintColor } = useStyle();

  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <Pressable style={containerStyle}>
      <Input
        {...props}
        value={value}
        onChangeText={setValue}
        inputStyle={({ isFocused }) => ({
          borderColor: isFocused ? activeTintColor : tintColor,
        })}
        renderRight={({ isFocused }) => (
          <Button
            onPress={() => onSubmit(value)}
            disabled={pattern ? !pattern.test(value) : !value}
          >
            <Icon
              name={iconName!}
              size={iconSize}
              color={isFocused && value ? activeTintColor : tintColor}
            />
          </Button>
        )}
      />
    </Pressable>
  );
};
