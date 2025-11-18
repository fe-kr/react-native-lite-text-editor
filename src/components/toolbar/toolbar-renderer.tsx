import { Platform, View } from 'react-native';
import { useToolbar } from './model/toolbar-context';
import type { Action, CommandsInfo } from '../../types';
import { isBoolean, isNil } from '../../utils/guards';
import { ToolbarAccordion } from './toolbar-accordion';
import { ToolbarItem, type ToolbarItemProps } from './toolbar-item';

export interface CustomToolbarItem {
  id?: string;
  type: 'custom';
  Component?: React.ComponentType<any>;
  onClose?: () => void;
}

export interface ContainerToolbarItem {
  id?: string;
  type: 'container';
  items: (DefaultToolbarItem | CustomToolbarItem | NestedToolbarItem)[];
  containerStyle: ToolbarItemProps['containerStyle'];
  onClose?: () => void;
}

export interface DefaultToolbarItem extends ToolbarItemProps {
  action?: Action;
  onClose?: () => void;
}

export interface NestedToolbarItem extends ToolbarItemProps {
  defaultValue?: string;
  closeable?: boolean;
  action?: Action;
  items: (DefaultToolbarItem | CustomToolbarItem | ContainerToolbarItem)[];
}

export type ToolbarRenderItem =
  | DefaultToolbarItem
  | CustomToolbarItem
  | ContainerToolbarItem
  | NestedToolbarItem;

export const ToolbarRenderer = (props: ToolbarRenderItem) => {
  const { dispatch, focus, data } = useToolbar();

  if (isCustomItem(props)) {
    const { Component, ...restProps } = props;

    return !!Component && <Component {...restProps} />;
  }

  if (isContainerItem(props)) {
    const { items, containerStyle, onClose } = props;

    return (
      <View style={containerStyle}>
        {items?.map((item, i) => (
          <ToolbarRenderer onClose={onClose} {...item} key={i} />
        ))}
      </View>
    );
  }

  if (isNestedItem(props)) {
    const { type, value, items, defaultValue, closeable, ...restProps } = props;

    const option = isNil(value)
      ? items.find(
          (item) => 'action' in item && getIsActiveAction(data, item.action)
        )
      : undefined;

    const defaultOption = !isNil(defaultValue)
      ? items.find((item) => 'value' in item && value === defaultValue)
      : undefined;

    const selectable = !!(defaultValue && option);

    return (
      <ToolbarAccordion
        {...restProps}
        transparent
        type={type}
        value={value}
        onShow={Platform.OS === 'web' ? focus : undefined}
        option={option}
        defaultOption={defaultOption}
      >
        {items.map((item, index) => (
          <ToolbarRenderer
            {...item}
            {...(selectable && { selected: item.id === option.id })}
            onClose={closeable ? close : undefined}
            key={item.id ?? index}
          />
        ))}
      </ToolbarAccordion>
    );
  }

  const { action, onClose, ...restProps } = props;
  const { enabled } = data && action ? data[action.type] ?? {} : {};

  return (
    <ToolbarItem
      {...restProps}
      disabled={restProps.disabled ?? (isBoolean(enabled) && !enabled)}
      selected={restProps.selected ?? getIsActiveAction(data, action)}
      onPressIn={action?.meta?.focusable ? focus : restProps.onPressIn}
      onPressOut={onClose ?? restProps.onPressOut}
      onPress={action ? () => dispatch(action) : restProps.onPress}
    />
  );
};

const isContainerItem = (item: object): item is ContainerToolbarItem => {
  return 'type' in item && item.type === 'container';
};

const isCustomItem = (item: object): item is CustomToolbarItem => {
  return 'type' in item && item.type === 'custom';
};

const isNestedItem = (item: object): item is NestedToolbarItem => {
  return 'items' in item && !isContainerItem(item);
};

const getIsActiveAction = (data?: CommandsInfo, action?: Action) => {
  if (!action || !data || !data[action.type]) return false;

  const { state } = data[action.type]!;

  return isBoolean(state) ? state : state === action.payload;
};
