import { StyleSheet } from 'react-native';
import { stringifyStyleMap } from 'react-style-stringify';

export const defaultStyles = stringifyStyleMap(
  StyleSheet.create({
    '.rnlte-root': {
      borderWidth: 1,
      borderColor: '#ccced1',
      borderStyle: 'solid',
    },
    '.rnlte-root:focus': {
      borderColor: 'rgb(55, 121, 235)',
    },
    '.block': {
      borderWidth: 1,
      borderStyle: 'dashed',
      padding: 8,
    },
    '.label': {
      fontWeight: 600,
      color: '#555555',
      marginBottom: 8,
    },
    'blockquote': {
      borderWidth: 0,
      borderLeftWidth: 5,
      borderStyle: 'solid',
      borderLeftColor: '#cccccc',
      fontStyle: 'italic',
      marginBlock: 16,
      paddingInline: 16,
    },
    'section': {
      marginBottom: 16,
    },
    'code': {
      display: 'flex',
      backgroundColor: '#f5f7fa',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 4,
    },
  })
);
