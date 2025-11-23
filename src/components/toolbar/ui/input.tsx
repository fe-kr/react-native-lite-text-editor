import {
  TextInput,
  View,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useState } from 'react';

export interface InputProps extends TextInputProps {
  inputStyle?:
    | StyleProp<ViewStyle>
    | ((state: InputState) => StyleProp<ViewStyle>);
  renderLeft?: (state: InputState) => React.ReactNode;
  renderRight?: (state: InputState) => React.ReactNode;
}

type InputState = { isFocused: boolean };

export const Input = ({
  onBlur,
  onFocus,
  inputStyle,
  style,
  renderRight,
  renderLeft,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle =
    typeof inputStyle === 'function' ? inputStyle({ isFocused }) : inputStyle;

  const onInputBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const onInputFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLeft?.({ isFocused })}

      <TextInput
        {...props}
        onBlur={onInputBlur}
        onFocus={onInputFocus}
        style={[styles.input, style]}
      />

      {renderRight?.({ isFocused })}
    </View>
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
    outlineWidth: 0,
  },
});
