import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import {
  useToolbarData,
  useToolbarStyle,
  type ToolbarDataParams,
} from 'react-native-lite-text-editor';

export interface FormInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  onSubmit: (data: ToolbarDataParams & { value: string }) => void;
}

export const FormInput = ({
  containerStyle,
  onSubmit,
  style,
  ...props
}: FormInputProps) => {
  const { Icon, theme } = useToolbarStyle();
  const toolbarData = useToolbarData();

  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { tintColor, selectedTintColor } = theme.palette;

  const inputStyle = {
    borderColor: isFocused ? selectedTintColor : tintColor,
  };

  return (
    <Pressable style={[containerStyle, styles.container]}>
      <TextInput
        {...props}
        value={value}
        onChangeText={setValue}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        style={[styles.input, inputStyle, style]}
      />

      <Pressable
        onPress={() => onSubmit({ ...toolbarData, value })}
        disabled={!value}
      >
        <Icon
          {...theme.components.Icon}
          name="check"
          color={isFocused && value ? selectedTintColor : tintColor}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    gap: 4,
    borderWidth: 2,
  },
  input: {
    marginLeft: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    outlineWidth: 0,
  },
});
