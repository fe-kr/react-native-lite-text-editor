import { Text, type TextProps } from 'react-native';

export interface IconProps extends TextProps, React.RefAttributes<Text> {
  name: string;
  size?: number;
  color?: string;
  innerRef?: React.Ref<Text>;
}

export const Icon: React.ComponentType<IconProps> = getDefaultIcon();

function getDefaultIcon() {
  try {
    const module = require('@react-native-vector-icons/material-icons');

    return module?.default ?? module;
  } catch {
    return (props: TextProps) => <Text {...props}>?</Text>;
  }
}
