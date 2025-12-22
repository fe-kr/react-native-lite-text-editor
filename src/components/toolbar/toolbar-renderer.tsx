import { Platform, View } from 'react-native';
import type { Action, Callback, CommandsInfo } from '../../types';
import { type ToolbarItemProps } from './toolbar-item';
import { useToolbarStyle } from './toolbar-style-provider';
import { useToolbarData } from './toolbar-data-provider';
import type { ToolbarPopoverProps } from './toolbar-popover';

export interface CustomToolbarItem {
  id?: string;
  type: 'custom';
  Component?: React.ComponentType<any>;
  onClose?: Callback;
}

export interface ContainerToolbarItem {
  id?: string;
  type: 'container';
  items: (DefaultToolbarItem | CustomToolbarItem | NestedToolbarItem)[];
  containerStyle?: ToolbarItemProps['containerStyle'];
  onClose?: Callback;
}

export interface DefaultToolbarItem extends ToolbarItemProps {
  action?: Action;
  onClose?: Callback;
}

export interface NestedToolbarItem extends ToolbarItemProps {
  defaultValue?: string;
  closeable?: boolean;
  action?: Action;
  popoverProps?: Partial<Omit<ToolbarPopoverProps, 'anchor' | 'children'>>;
  items: (DefaultToolbarItem | CustomToolbarItem | ContainerToolbarItem)[];
}

export type ToolbarRenderItem =
  | DefaultToolbarItem
  | CustomToolbarItem
  | ContainerToolbarItem
  | NestedToolbarItem;

export const ToolbarRenderer = (props: ToolbarRenderItem) => {
  const { dispatch, focus, data, popover } = useToolbarData();
  const { theme, Item, Popover } = useToolbarStyle();

  if (ItemHelpers.isCustom(props)) {
    const { Component, ...restProps } = props;

    return !!Component && <Component {...restProps} />;
  }

  if (ItemHelpers.isContainer(props)) {
    const { items, containerStyle, onClose } = props;

    return (
      <View style={containerStyle}>
        {items?.map((item, i) => (
          <ToolbarRenderer onClose={onClose} {...item} key={item.id ?? i} />
        ))}
      </View>
    );
  }

  if (ItemHelpers.isNested(props)) {
    const {
      id,
      items,
      defaultValue,
      closeable,
      action,
      popoverProps,
      ...restProps
    } = props;

    const option = !restProps.value
      ? items.find(
          (i) =>
            ItemHelpers.isDefault(i) && ItemHelpers.isActive(data, i.action)
        )
      : null;

    const defaultOption = defaultValue
      ? items.find((i) => ItemHelpers.isDefault(i) && i.value === defaultValue)
      : null;

    const selectedOption = option ?? defaultOption;
    const selectable = !!(defaultValue && selectedOption?.id);

    const isOpen = popover.isOpen(id);

    return (
      <Popover
        {...theme.components.Popover}
        {...popoverProps}
        style={[theme.components.Popover.style, popoverProps?.style]}
        wrapperStyle={[
          theme.components.Popover.wrapperStyle,
          popoverProps?.wrapperStyle,
        ]}
        containerStyle={[
          theme.components.Popover.containerStyle,
          popoverProps?.containerStyle,
        ]}
        overlayStyle={[
          theme.components.Popover.overlayStyle,
          popoverProps?.overlayStyle,
        ]}
        visible={isOpen}
        onDismiss={() => {
          popover.close(id);
          popoverProps?.onDismiss?.();
        }}
        anchor={
          <Item
            {...restProps}
            {...(selectedOption as DefaultToolbarItem | null)}
            id={id}
            selected={isOpen}
            onPress={() => popover.open(id)}
          />
        }
        onShow={() => {
          if (action?.meta?.showKeyboard ?? Platform.OS === 'web') {
            focus();
          }
          popoverProps?.onShow?.();
        }}
      >
        {items.map((item, index) => (
          <ToolbarRenderer
            {...item}
            {...(selectable && {
              selected: item.id === selectedOption?.id,
            })}
            onClose={closeable ? () => popover.close(id) : undefined}
            key={item.id ?? index}
          />
        ))}
      </Popover>
    );
  }

  const { action, onClose, onPress, ...restProps } = props;

  return (
    <Item
      {...restProps}
      disabled={restProps.disabled ?? !ItemHelpers.isEnabled(data, action)}
      selected={restProps.selected ?? ItemHelpers.isActive(data, action)}
      onPress={(e) => {
        if (action?.meta?.showKeyboard ?? Platform.OS === 'web') {
          focus();
        }

        if (action) {
          dispatch(action);
        }

        onPress?.(e);
        onClose?.();
      }}
    />
  );
};

export class ItemHelpers {
  static isItem = <T extends { type: string }>(item: object): item is T => {
    return 'type' in item && typeof item.type === 'string';
  };

  static isContainer = (item: object): item is ContainerToolbarItem => {
    return ItemHelpers.isItem(item) && item.type === 'container';
  };

  static isCustom = (item: object): item is CustomToolbarItem => {
    return ItemHelpers.isItem(item) && item.type === 'custom';
  };

  static isDefault = (item: object): item is DefaultToolbarItem => {
    return (
      ItemHelpers.isItem(item) && ['icon', 'color', 'text'].includes(item.type)
    );
  };

  static isNested = (item: object): item is NestedToolbarItem => {
    return 'items' in item && !ItemHelpers.isContainer(item);
  };

  static isActive = (data?: CommandsInfo, action?: Action | null) => {
    if (!action || !data || !data[action.type]) return false;

    const { state } = data[action.type]!;

    return typeof state === 'boolean' ? state : state === action.payload;
  };

  static isEnabled = (data?: CommandsInfo, action?: Action) => {
    const { enabled } = data && action ? data[action.type] ?? {} : {};

    return typeof enabled === 'boolean' && enabled;
  };
}
