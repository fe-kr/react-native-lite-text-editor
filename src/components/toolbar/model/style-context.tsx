import { createContext, useContext } from 'react';
import { type IconProps } from '../ui/icon';
import { type PopoverProps } from '../ui/popover';
import { type TooltipProps } from '../ui/tooltip';

export interface StyleParams {
  tintColor: string;
  activeTintColor: string;
  iconSize: number;
  Icon: React.ComponentType<IconProps>;
  dropdownIconProps?: IconProps;
  Popover: React.ComponentType<PopoverProps>;
  popoverProps?: Partial<PopoverProps>;
  tooltipProps?: Partial<TooltipProps>;
}

export const StyleContext = createContext<StyleParams>(null!);

export const useStyle = () => useContext(StyleContext);
