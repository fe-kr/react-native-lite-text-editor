import { useCallback, useState } from 'react';
import { type PopoverProps } from './ui/popover';
import { type IconProps } from './ui/icon';
import { ToolbarItem, type ToolbarItemProps } from './toolbar-item';
import { StyleSheet } from 'react-native';
import { useStyle } from './model/style-context';
import type { Callback } from '../../types';

export interface ToolbarAccordionProps
  extends Omit<Partial<PopoverProps>, 'children'>,
    Pick<ToolbarItemProps, 'type' | 'name' | 'value' | 'title'> {
  children: (params: { open: Callback; close: Callback }) => React.ReactNode;
}

export const ToolbarAccordion = ({
  type,
  title,
  name,
  value,
  style,
  containerStyle,
  children,
  ...props
}: ToolbarAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    Icon,
    Popover,
    dropdownIconProps,
    iconSize,
    tintColor,
    activeTintColor,
    popoverProps,
  } = useStyle();

  const close = useCallback(() => setIsOpen(false), []);

  const open = useCallback(() => setIsOpen(true), []);

  return (
    <Popover
      {...popoverProps}
      {...props}
      visible={isOpen}
      onDismiss={close}
      containerStyle={[popoverProps?.containerStyle, containerStyle]}
      anchor={
        <ToolbarItem
          title={title}
          name={name}
          value={value}
          type={type}
          selected={isOpen}
          style={style}
          containerStyle={styles.row}
          onPress={open}
        >
          <Icon
            {...(dropdownIconProps ?? ({} as IconProps))}
            color={isOpen ? activeTintColor : tintColor}
            size={iconSize}
          />
        </ToolbarItem>
      }
    >
      {children({ open, close })}
    </Popover>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
