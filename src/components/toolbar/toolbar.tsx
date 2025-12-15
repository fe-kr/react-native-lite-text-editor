import {
  FlatList,
  Text,
  type FlatListProps,
  type ListRenderItem,
} from 'react-native';
import { ToolbarRenderer, type ToolbarRenderItem } from './toolbar-renderer';
import type { CommandsInfo, ExtendedWebView } from '../../types';
import { memo } from 'react';
import { ToolbarPopover } from './toolbar-popover';
import {
  type ToolbarStyleParams,
  ToolbarStyleProvider,
  type ToolbarTheme,
} from './toolbar-style-provider';
import { ToolbarItem } from './toolbar-item';
import { ToolbarDataProvider } from './toolbar-data-provider';

export interface ToolbarProps<T = CommandsInfo>
  extends Omit<FlatListProps<ToolbarRenderItem>, 'data' | 'renderItem'>,
    Partial<ToolbarStyleParams> {
  data: T;
  config?: ToolbarRenderItem[];
  renderItem?: ListRenderItem<ToolbarRenderItem>;
  editorRef: React.RefObject<ExtendedWebView | null>;
}

const Toolbar = <T extends CommandsInfo>(props: ToolbarProps<T>) => {
  const {
    editorRef,
    config,
    data,
    theme,
    renderItem,
    Icon,
    Item,
    Popover,
    ...listProps
  } = { ...defaultProps, ...props };

  return (
    <ToolbarStyleProvider
      theme={theme}
      Icon={Icon}
      Item={Item}
      Popover={Popover}
    >
      <ToolbarDataProvider {...editorRef.current!} data={data}>
        <FlatList {...listProps} data={config} renderItem={renderItem} />
      </ToolbarDataProvider>
    </ToolbarStyleProvider>
  );
};

const defaultProps = {
  editorRef: { current: null },
  theme: {} as ToolbarTheme,
  data: {} as CommandsInfo,
  renderItem: ({ item }) => <ToolbarRenderer {...item} />,
  Icon: Text,
  Item: ToolbarItem,
  Popover: ToolbarPopover,
} satisfies ToolbarProps;

export default memo(Toolbar);
