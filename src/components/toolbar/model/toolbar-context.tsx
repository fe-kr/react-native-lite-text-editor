import { createContext, useContext } from 'react';
import type { CommandsInfo, ExtendedWebView } from '../../../types';

interface ToolbarParams extends Pick<ExtendedWebView, 'focus' | 'dispatch'> {
  data: CommandsInfo;
}

export const ToolbarContext = createContext<ToolbarParams>(null!);

export const useToolbar = () => useContext(ToolbarContext);

export const withToolbar =
  <T extends object>(Component: React.ComponentType<T & ToolbarParams>) =>
  (props: T) => {
    const toolbarData = useToolbar();

    return <Component {...props} {...toolbarData} />;
  };
