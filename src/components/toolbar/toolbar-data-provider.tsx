import { createContext, useContext } from 'react';
import type { ExtendedWebView, CommandsInfo } from '../../types';
import { usePopover } from './toolbar-popover';

export interface ToolbarDataParams
  extends Pick<ExtendedWebView, 'focus' | 'dispatch'> {
  data: CommandsInfo;
}

interface ToolbarDataContext extends ToolbarDataParams {
  popover: ReturnType<typeof usePopover>;
}

const ToolbarData = createContext<ToolbarDataContext>(null!);

export const ToolbarDataProvider = ({
  children,
  ...props
}: React.PropsWithChildren<ToolbarDataParams>) => {
  const popover = usePopover();

  return (
    <ToolbarData.Provider value={{ popover, ...props }}>
      {children}
    </ToolbarData.Provider>
  );
};

export const useToolbarData = () => useContext(ToolbarData);
