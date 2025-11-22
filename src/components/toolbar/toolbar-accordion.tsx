import { useCallback, useState } from 'react';
import { type PopoverProps } from './ui/popover';
import { type IconProps } from './ui/icon';
import { ToolbarItem, type ToolbarItemProps } from './toolbar-item';
import { StyleSheet } from 'react-native';
import { useStyle } from './model/style-context';

export interface ToolbarAccordionProps
  extends Partial<PopoverProps>,
    Pick<ToolbarItemProps, 'type' | 'name' | 'value' | 'title'> {}

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

  const onClose = useCallback(() => setIsOpen(false), []);

  const onOpen = useCallback(() => setIsOpen(true), []);

  return (
    <Popover
      {...popoverProps}
      {...props}
      visible={isOpen}
      onDismiss={onClose}
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
          onPress={onOpen}
        >
          <Icon
            {...(dropdownIconProps ?? ({} as IconProps))}
            color={isOpen ? activeTintColor : tintColor}
            size={iconSize}
          />
        </ToolbarItem>
      }
    >
      {children}
    </Popover>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
