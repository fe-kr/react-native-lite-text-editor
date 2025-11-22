import {
  FlatList,
  type FlatListProps,
  type ListRenderItem,
} from 'react-native';
import { ToolbarRenderer, type ToolbarRenderItem } from './toolbar-renderer';
import type { CommandsInfo, ExtendedWebView } from '../../types';
import { ToolbarContext } from './model/toolbar-context';
import { memo, useMemo } from 'react';
import { Icon as DefaultIcon } from './ui/icon';
import { Popover as DefaultPopover } from './ui/popover';
import { type StyleParams, StyleContext } from './model/style-context';

export interface ToolbarProps<T = CommandsInfo>
  extends Omit<FlatListProps<ToolbarRenderItem>, 'data' | 'renderItem'>,
    Partial<StyleParams> {
  data: T;
  config?: ToolbarRenderItem[];
  renderItem?: ListRenderItem<ToolbarRenderItem>;
  editorRef: React.RefObject<ExtendedWebView | null>;
}

const Toolbar = <T extends CommandsInfo>({
  editorRef,
  config,
  data,
  tintColor = 'rgb(0, 0, 0)',
  activeTintColor = 'rgb(77, 77, 230)',
  iconSize = 20,
  renderItem = renderToolbarItem,
  dropdownIconProps,
  Icon = DefaultIcon,
  Popover = DefaultPopover,
  popoverProps,
  tooltipProps,
  ...props
}: ToolbarProps<T>) => {
  const { dispatch = noop, focus = noop } = editorRef?.current ?? {};

  const styleSettings = useMemo(
    () => ({
      Icon,
      Popover,
      dropdownIconProps,
      tintColor,
      activeTintColor,
      iconSize,
      popoverProps,
      tooltipProps,
    }),
    [
      dropdownIconProps,
      Icon,
      Popover,
      activeTintColor,
      iconSize,
      tooltipProps,
      popoverProps,
      tintColor,
    ]
  );

  const dataSettings = useMemo(
    () => ({ data, dispatch, focus }),
    [data, dispatch, focus]
  );

  return (
    <StyleContext.Provider value={styleSettings}>
      <ToolbarContext.Provider value={dataSettings}>
        <FlatList {...props} data={config} renderItem={renderItem} />
      </ToolbarContext.Provider>
    </StyleContext.Provider>
  );
};

const noop = () => {};

const renderToolbarItem: ListRenderItem<ToolbarRenderItem> = ({ item }) => (
  <ToolbarRenderer {...item} />
);

export default memo(Toolbar);
