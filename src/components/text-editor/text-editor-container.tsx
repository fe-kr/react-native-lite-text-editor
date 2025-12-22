import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

export const Container = forwardRef<Partial<View>, React.PropsWithChildren>(
  ({ children }, ref) => {
    const inputRef = useRef<React.ComponentRef<TextInput> | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
      }),
      []
    );

    if (Platform.OS === 'android') {
      return (
        <>
          <TextInput ref={inputRef} style={styles.input} />
          {children}
        </>
      );
    }

    return children;
  }
);

const styles = StyleSheet.create({
  input: {
    position: 'absolute',
    width: 1,
    height: 1,
    zIndex: -999,
    bottom: -999,
    left: -999,
  },
});
