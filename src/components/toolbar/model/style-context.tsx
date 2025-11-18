import { createContext, useContext } from 'react';
import { type IconProps } from '../ui/icon';
import { type PopoverProps } from '../ui/popover';

export interface StyleParams {
  tintColor: string;
  activeTintColor: string;
  iconSize: number;
  DropdownIcon: React.ComponentType<Partial<IconProps>>;
  popoverProps?: Partial<PopoverProps>;
  Icon: React.ComponentType<IconProps>;
  Popover: React.ComponentType<PopoverProps>;
}

export const StyleContext = createContext<StyleParams>(null!);

export const useStyle = () => useContext(StyleContext);
