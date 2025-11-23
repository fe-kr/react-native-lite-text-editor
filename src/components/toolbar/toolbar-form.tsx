import { useState } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { Input, type InputProps } from './ui/input';
import { Button } from './ui/button';
import type { Action } from '../../types';
import { useStyle } from './model/style-context';

export interface ToolbarFormProps extends InputProps {
  iconName?: string;
  action?: (value: string) => Action;
  inputStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onSubmit: (value: string) => void;
}

export const ToolbarForm = ({
  defaultValue,
  iconName,
  containerStyle,
  onSubmit,
  inputStyle,
  ...props
}: ToolbarFormProps) => {
  const { Icon, iconSize, tintColor, activeTintColor } = useStyle();

  const [value, setValue] = useState(defaultValue ?? '');

  const onValueSubmit = () => onSubmit(value);

  return (
    <Pressable style={containerStyle}>
      <Input
        {...props}
        value={value}
        onChangeText={setValue}
        inputStyle={({ isFocused }) => [
          {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderColor: isFocused ? activeTintColor : tintColor,
          },
          inputStyle,
        ]}
        renderRight={({ isFocused }) => (
          <Button onPress={onValueSubmit} disabled={!value}>
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
