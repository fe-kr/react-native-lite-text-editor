import {
  actions,
  DocumentCommandId,
  ToolbarForm,
  withToolbar,
  type HTMLElementTag,
  type ToolbarRenderItem,
  type CustomToolbarItem,
} from 'react-native-lite-text-editor';
import {
  type Option,
  colorOptions,
  fontNameOptions,
  fontSizeOptions,
  headingOptions,
} from './options';
import { StyleSheet } from 'react-native';
import { createElement } from 'react';

const fields = {
  undo: {
    id: DocumentCommandId.UNDO,
    type: 'icon',
    title: 'Undo',
    value: 'undo',
    action: actions.undo,
  },
  redo: {
    id: DocumentCommandId.REDO,
    type: 'icon',
    title: 'Redo',
    value: 'redo',
    action: actions.redo,
  },
  heading: ({ name, value }: Option<HTMLElementTag>) => ({
    id: `${DocumentCommandId.FORMAT_BLOCK}.${value}`,
    type: 'text' as const,
    name,
    value,
    action: actions.formatBlock(value),
  }),
  bold: {
    id: DocumentCommandId.BOLD,
    type: 'icon',
    title: 'Bold',
    value: 'format-bold',
    action: actions.bold,
  },
  italic: {
    id: DocumentCommandId.ITALIC,
    type: 'icon',
    title: 'Italic',
    value: 'format-italic',
    action: actions.italic,
  },
  underline: {
    id: DocumentCommandId.UNDERLINE,
    type: 'icon',
    title: 'Underline',
    value: 'format-underline',
    action: actions.underline,
  },
  strikeThrough: {
    id: DocumentCommandId.STRIKE_THROUGH,
    type: 'icon',
    title: 'Strike through',
    value: 'format-strikethrough',
    action: actions.strikeThrough,
  },
  subscript: {
    id: DocumentCommandId.SUBSCRIPT,
    type: 'icon',
    title: 'Subscript',
    value: 'subscript',
    action: actions.subscript,
  },
  superscript: {
    id: DocumentCommandId.SUPERSCRIPT,
    type: 'icon',
    title: 'Superscript',
    value: 'superscript',
    action: actions.superscript,
  },
  removeFormat: {
    id: DocumentCommandId.REMOVE_FORMAT,
    type: 'icon',
    title: 'Remove format',
    value: 'format-clear',
    action: actions.removeFormat,
  },
  fontSize: ({ name, value }: Option, index: number): ToolbarRenderItem => ({
    id: `${DocumentCommandId.FONT_SIZE}.${index}`,
    type: 'icon',
    title: name,
    value,
    action: actions.fontSize(index + 1),
  }),
  fontName: ({ name, value }: Option): ToolbarRenderItem => ({
    id: `${DocumentCommandId.FONT_NAME}.${value}`,
    type: 'text' as const,
    name,
    value,
    style: { fontFamily: value },
    action: actions.fontName(value),
  }),
  foreColor: ({ name, value }: Option): ToolbarRenderItem => ({
    id: `${DocumentCommandId.FORE_COLOR}.${value}`,
    type: 'color',
    title: name,
    value,
    action: actions.foreColor(value),
  }),
  backColor: ({ value, name }: Option): ToolbarRenderItem => ({
    id: `${DocumentCommandId.BACK_COLOR}.${value}`,
    type: 'color',
    title: name,
    value,
    action: actions.backColor(value),
  }),
  blockquote: {
    id: `${DocumentCommandId.FORMAT_BLOCK}.blockquote`,
    type: 'icon',
    title: 'Block quote',
    value: 'format-quote',
    action: actions.formatBlock('blockquote'),
  },
  insertHorizontalRule: {
    id: DocumentCommandId.INSERT_HORIZONTAL_RULE,
    type: 'icon',
    title: 'Rule',
    value: 'horizontal-rule',
    action: actions.insertHorizontalRule,
  },
  insertOrderedList: {
    id: DocumentCommandId.INSERT_ORDERED_LIST,
    type: 'icon',
    title: 'Numbered List',
    value: 'format-list-numbered',
    action: actions.orderedList,
  },
  insertUnorderedList: {
    id: DocumentCommandId.INSERT_UNORDERED_LIST,
    type: 'icon',
    title: 'Bullet List',
    value: 'format-list-bulleted',
    action: actions.unorderedList,
  },
  indent: {
    id: DocumentCommandId.INDENT,
    type: 'icon',
    title: 'Increase indent',
    value: 'format-indent-increase',
    action: actions.indent,
  },
  outdent: {
    id: DocumentCommandId.OUTDENT,
    type: 'icon',
    title: 'Decrease indent',
    value: 'format-indent-decrease',
    action: actions.outdent,
  },
  justifyLeft: {
    id: DocumentCommandId.JUSTIFY_LEFT,
    type: 'icon',
    title: 'Align left',
    value: 'format-align-left',
    action: actions.justifyLeft,
  },
  justifyCenter: {
    id: DocumentCommandId.JUSTIFY_CENTER,
    type: 'icon',
    title: 'Align center',
    value: 'format-align-center',
    action: actions.justifyCenter,
  },
  justifyRight: {
    id: DocumentCommandId.JUSTIFY_RIGHT,
    type: 'icon',
    title: 'Align right',
    value: 'format-align-right',
    action: actions.justifyRight,
  },
  justifyFull: {
    id: DocumentCommandId.JUSTIFY_FULL,
    type: 'icon',
    title: 'Justify',
    value: 'format-align-justify',
    action: actions.justifyFull,
  },
  insertCheckboxList: {
    id: `${DocumentCommandId.FORMAT_BLOCK}.insertCheckboxList`,
    type: 'icon',
    value: 'checklist',
    action: {
      type: 'insertCheckboxList',
      meta: { focusable: true, selectable: true },
    },
  },
  code: {
    id: `${DocumentCommandId.FORMAT_BLOCK}.code`,
    type: 'icon',
    title: 'Code',
    value: 'code',
    action: {
      type: 'insertCode',
      meta: { focusable: true, selectable: true },
    },
  },
  createLink: {
    id: DocumentCommandId.CREATE_LINK,
    type: 'custom',
    Component: withToolbar<CustomToolbarItem>(({ dispatch, onClose }) =>
      createElement(ToolbarForm, {
        iconName: 'check',
        placeholder: 'Type link href...',
        onSubmit: (value) => {
          dispatch(actions.createLink(value));
          onClose?.();
        },
      })
    ),
  },
  insertImage: {
    id: DocumentCommandId.INSERT_IMAGE,
    type: 'custom',
    Component: withToolbar<CustomToolbarItem>(({ dispatch, onClose }) =>
      createElement(ToolbarForm, {
        iconName: 'check',
        placeholder: 'Type image URL...',
        onSubmit: (value) => {
          dispatch(actions.insertImage(value));
          onClose?.();
        },
      })
    ),
  },
} as const;

export const createConfig = (): ToolbarRenderItem[] => [
  {
    type: 'container',
    items: [fields.undo, fields.redo],
  },
  {
    type: 'text',
    defaultValue: 'p',
    title: 'Heading',
    containerStyle: styles.textContainer,
    items: headingOptions.map(fields.heading),
  },
  {
    type: 'container',
    items: [
      fields.bold,
      fields.italic,
      fields.underline,
      fields.strikeThrough,
      fields.subscript,
      fields.superscript,
      fields.removeFormat,
    ],
  },
  {
    type: 'container',
    items: [
      {
        type: 'icon',
        title: 'Font size',
        value: 'format-size',
        items: fontSizeOptions.map(fields.fontSize),
      },
      {
        type: 'icon',
        title: 'Font family',
        value: 'font-download',
        containerStyle: styles.textContainer,
        items: fontNameOptions.map(fields.fontName),
      },
      {
        type: 'icon',
        title: 'Font color',
        value: 'format-color-text',
        containerStyle: styles.paletteContainer,
        items: colorOptions.map(fields.foreColor),
      },
      {
        type: 'icon',
        title: 'Font background color',
        value: 'format-color-fill',
        containerStyle: styles.paletteContainer,
        items: colorOptions.map(fields.backColor),
      },
    ],
  },
  {
    type: 'container',
    items: [fields.blockquote, fields.code, fields.insertHorizontalRule],
  },
  {
    type: 'container',
    items: [
      fields.insertOrderedList,
      fields.insertUnorderedList,
      fields.insertCheckboxList,
    ],
  },
  {
    type: 'container',
    items: [
      fields.indent,
      fields.outdent,
      {
        type: 'icon',
        title: 'Text alignment',
        closeable: true,
        defaultValue: fields.justifyLeft.value,
        items: [
          fields.justifyLeft,
          fields.justifyCenter,
          fields.justifyRight,
          fields.justifyFull,
        ],
      },
    ],
  },
  {
    type: 'container',
    items: [
      {
        type: 'icon',
        value: 'link',
        closeable: true,
        items: [fields.createLink],
      },
      {
        type: 'icon',
        value: 'insert-photo',
        closeable: true,
        items: [fields.insertImage],
      },
    ],
  },
];

const styles = StyleSheet.create({
  paletteContainer: {
    maxWidth: 110,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  textContainer: {
    gap: 4,
    padding: 4,
  },
});
