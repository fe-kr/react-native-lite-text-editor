import { createContext, memo, useContext } from 'react';
import { type TextProps } from 'react-native';
import { type ToolbarPopoverProps } from './toolbar-popover';
import { type ToolbarItemProps } from './toolbar-item';
import type { DeepPartial } from '../../types';

export interface ToolbarIconProps extends TextProps {
  name: string;
  size?: number;
  color?: string;
}

export interface ToolbarTheme {
  palette: {
    tintColor: string;
    selectedTintColor: string;
    activeOpacity: number;
    disabledOpacity: number;
  };
  components: {
    Icon: Partial<ToolbarIconProps>;
    Popover: Partial<ToolbarPopoverProps>;
  };
}

export interface ToolbarStyleParams {
  theme: ToolbarTheme;
  Icon: React.ComponentType<ToolbarIconProps>;
  Item: React.ComponentType<ToolbarItemProps>;
  Popover: React.ComponentType<ToolbarPopoverProps>;
}

export interface ToolbarStyleProviderProps
  extends React.PropsWithChildren<Omit<ToolbarStyleParams, 'theme'>> {
  theme: DeepPartial<ToolbarTheme>;
}

const ToolbarStyleContext = createContext<ToolbarStyleParams>(null!);

export const ToolbarStyleProvider = memo(
  ({ children, ...props }: ToolbarStyleProviderProps) => {
    return (
      <ToolbarStyleContext.Provider
        value={{ ...props, theme: mergeThemes(defaultTheme, props.theme) }}
      >
        {children}
      </ToolbarStyleContext.Provider>
    );
  }
);

const mergeThemes = (
  theme: ToolbarTheme,
  overrides: DeepPartial<ToolbarTheme>
) => ({
  ...overrides,
  palette: { ...theme.palette, ...overrides.palette },
  components: { ...theme.components, ...overrides.components },
});

export const useToolbarStyle = () => useContext(ToolbarStyleContext);

const defaultTheme = {
  palette: {
    tintColor: 'rgba(0, 0, 0, 1)',
    selectedTintColor: 'rgba(77, 77, 230, 1)',
    activeOpacity: 0.12,
    disabledOpacity: 0.38,
  },
  components: {
    Icon: {},
    Popover: {},
  },
} satisfies ToolbarTheme;
