import { useCallback, useState } from 'react';
import { type PopoverProps } from './ui/popover';
import { ToolbarItem, type ToolbarItemProps } from './toolbar-item';
import { StyleSheet } from 'react-native';
import { useStyle } from './model/style-context';

type Option = Pick<ToolbarItemProps, 'name' | 'value' | 'id'>;

export interface ToolbarAccordionProps extends Partial<PopoverProps> {
  type: ToolbarItemProps['type'];
  value?: string;
  option?: Option;
  defaultOption?: Option;
}

export const ToolbarAccordion = ({
  type,
  value,
  style,
  containerStyle,
  option,
  defaultOption,
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
          name={option?.name ?? defaultOption?.name}
          value={value ?? option?.value ?? defaultOption?.value}
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
