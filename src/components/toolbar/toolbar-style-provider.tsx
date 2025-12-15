import React, { createContext, memo, useContext } from 'react';
import { type TextProps } from 'react-native';
import { type ToolbarPopoverProps } from './toolbar-popover';
import { type ToolbarItemProps } from './toolbar-item';

export interface ToolbarIconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}

export interface ToolbarTheme {
  palette: {
    tintColor?: string;
    selectedTintColor?: string;
    activeOpacity?: number;
    disabledOpacity?: number;
  };
  components: {
    Icon?: Partial<ToolbarIconProps>;
    Popover?: Partial<ToolbarPopoverProps>;
  };
}

export interface ToolbarStyleParams {
  theme: ToolbarTheme;
  Icon: React.ComponentType<ToolbarIconProps>;
  Item: React.ComponentType<ToolbarItemProps>;
  Popover: React.ComponentType<ToolbarPopoverProps>;
}

const ToolbarStyleContext = createContext<ToolbarStyleParams>(null!);

export const ToolbarStyleProvider = memo(
  ({ children, ...props }: React.PropsWithChildren<ToolbarStyleParams>) => {
    const palette = { ...defaultPalette, ...props.theme.palette };

    return (
      <ToolbarStyleContext.Provider
        value={{ ...props, theme: { ...props.theme, palette } }}
      >
        {children}
      </ToolbarStyleContext.Provider>
    );
  }
);

export const useToolbarStyle = () => useContext(ToolbarStyleContext);

const defaultPalette = {
  tintColor: 'rgba(0, 0, 0, 1)',
  selectedTintColor: 'rgba(77, 77, 230, 1)',
  activeOpacity: 0.12,
  disabledOpacity: 0.38,
} satisfies ToolbarTheme['palette'];
