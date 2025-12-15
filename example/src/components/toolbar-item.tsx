import {
  Toolbar,
  useToolbarStyle,
  type ToolbarItemProps,
} from 'react-native-lite-text-editor';
import { StyleSheet, Text } from 'react-native';
import { useState } from 'react';

export const ToolbarItem = ({ title, role, ...props }: ToolbarItemProps) => {
  const { Icon, Popover } = useToolbarStyle();

  const [isOpen, setIsOpen] = useState(false);

  if (!title) {
    return <Toolbar.Item {...props} />;
  }

  return (
    <Popover
      visible={isOpen}
      onDismiss={() => setIsOpen(false)}
      anchor={
        <Toolbar.Item
          {...props}
          containerStyle={styles.container}
          onLongPress={() => setIsOpen(true)}
        >
          {role === 'menu' && (
            <Icon
              name="arrow-drop-down"
              size={20}
              style={styles.dropdownIcon}
            />
          )}
        </Toolbar.Item>
      }
    >
      <Text style={styles.tooltip}>{title}</Text>
    </Popover>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  dropdownIcon: {
    marginLeft: 4,
  },
  tooltip: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
});
