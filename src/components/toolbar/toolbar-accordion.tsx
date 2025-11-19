import { useCallback, useState } from 'react';
import { type PopoverProps } from './ui/popover';
import { ToolbarItem, type ToolbarItemProps } from './toolbar-item';
import { StyleSheet } from 'react-native';
import { useStyle } from './model/style-context';

export interface ToolbarAccordionProps extends Partial<PopoverProps> {
  type: ToolbarItemProps['type'];
  name?: string;
  value?: string;
}

export const ToolbarAccordion = ({
  type,
  name,
  value,
  style,
  containerStyle,
  children,
  ...props
}: ToolbarAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    Popover,
    DropdownIcon,
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
      onRequestClose={onClose}
      containerStyle={[popoverProps?.containerStyle, containerStyle]}
      anchor={
        <ToolbarItem
          name={name}
          value={value}
          type={type}
          selected={isOpen}
          style={style}
          containerStyle={styles.row}
          onPress={onOpen}
        >
          <DropdownIcon
            color={isOpen ? activeTintColor : tintColor}
            size={iconSize}
            style={styles.dropdownIcon}
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
  dropdownIcon: {
    marginLeft: 4,
  },
});
