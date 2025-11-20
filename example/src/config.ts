import { createElement } from 'react';
import { Platform } from 'react-native';
import {
  type ToolbarRenderItem,
  type ToolbarProps,
  DocumentCommandId,
  actions,
  useToolbar,
  ToolbarForm,
} from 'react-native-lite-text-editor';

const colorOptions = [
  'rgb(0, 0, 0)',
  'rgb(77, 77, 77)',
  'rgb(153, 153, 153)',
  'rgb(230, 230, 230)',
  'rgb(255, 255, 255)',
  'rgb(230, 77, 77)',
  'rgb(230, 153, 77)',
  'rgb(230, 230, 77)',
  'rgb(153, 230, 77)',
  'rgb(77, 230, 77)',
  'rgb(77, 230, 153)',
  'rgb(77, 230, 230)',
  'rgb(77, 153, 230)',
  'rgb(77, 77, 230)',
  'rgb(153, 77, 230)',
];

export const fontKey = Platform.select({
  web: 'MaterialIcons-Regular',
  default: 'MaterialIcons',
});

export const dropdownIconProps: ToolbarProps['dropdownIconProps'] = {
  name: 'arrow-drop-down',
  style: { marginLeft: 4 },
};

export const toolbarConfig: ToolbarRenderItem[] = [
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        id: DocumentCommandId.UNDO,
        type: 'icon',
        value: 'undo',
        action: actions.undo,
      },
      {
        id: DocumentCommandId.REDO,
        type: 'icon',
        value: 'redo',
        action: actions.redo,
      },
    ],
  },
  {
    type: 'text',
    defaultValue: 'p',
    containerStyle: { gap: 4, padding: 4 },
    items: (
      [
        { name: 'Heading 1', value: 'h1' },
        { name: 'Heading 2', value: 'h2' },
        { name: 'Heading 3', value: 'h3' },
        { name: 'Heading 4', value: 'h4' },
        { name: 'Heading 5', value: 'h5' },
        { name: 'Heading 6', value: 'h6' },
        { name: 'Paragraph', value: 'p' },
      ] as const
    ).map(({ name, value }) => ({
      id: `${DocumentCommandId.FORMAT_BLOCK}.${value}`,
      type: 'text',
      name,
      value,
      action: actions.formatBlock(value),
    })),
  },
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        type: 'icon',
        value: 'title',
        items: [
          {
            id: DocumentCommandId.BOLD,
            type: 'icon',
            value: 'format-bold',
            action: actions.bold,
          },
          {
            id: DocumentCommandId.ITALIC,
            type: 'icon',
            value: 'format-italic',
            action: actions.italic,
          },
          {
            id: DocumentCommandId.UNDERLINE,
            type: 'icon',
            value: 'format-underline',
            action: actions.underline,
          },
          {
            id: DocumentCommandId.STRIKE_THROUGH,
            type: 'icon',
            value: 'format-strikethrough',
            action: actions.strikeThrough,
          },
          {
            id: DocumentCommandId.SUBSCRIPT,
            type: 'icon',
            value: 'subscript',
            action: actions.subscript,
          },
          {
            id: DocumentCommandId.SUPERSCRIPT,
            type: 'icon',
            value: 'superscript',
            action: actions.superscript,
          },
        ],
      },
      {
        id: DocumentCommandId.REMOVE_FORMAT,
        type: 'icon',
        value: 'format-clear',
        action: actions.removeFormat,
      },
    ],
  },
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        type: 'icon',
        value: 'format-size',
        items: Array.from({ length: 6 }).map((_, i) => ({
          id: `${DocumentCommandId.FONT_SIZE}.${i + 1}`,
          type: 'icon',
          value: [
            'looks-one',
            'looks-two',
            'looks-3',
            'looks-4',
            'looks-5',
            'looks-6',
          ][i],
          action: actions.fontSize(i + 1),
        })),
      },
      {
        type: 'icon',
        value: 'font-download',
        containerStyle: { gap: 4, padding: 4 },
        items: (
          [
            {
              name: 'Arial',
              value: 'Arial, sans-serif',
              style: { fontFamily: 'sans-serif', fontSize: 16 },
            },
            {
              name: 'Times New Roman',
              value: '"Times New Roman", serif',
              style: { fontFamily: 'serif', fontSize: 16 },
            },
          ] as const
        ).map(({ value, ...rest }) => ({
          ...rest,
          id: `${DocumentCommandId.FONT_NAME}.${value}`,
          type: 'text',
          value,
          action: actions.fontName(value),
        })),
      },
      {
        type: 'icon',
        value: 'format-color-text',
        containerStyle: {
          maxWidth: 110,
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
        },
        items: colorOptions.map((value) => ({
          id: `${DocumentCommandId.FORE_COLOR}.${value}`,
          type: 'color',
          value,
          action: actions.foreColor(value),
        })),
      },
      {
        type: 'icon',
        value: 'format-color-fill',
        containerStyle: {
          maxWidth: 110,
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
        },
        items: colorOptions.map((value) => ({
          id: `${DocumentCommandId.BACK_COLOR}.${value}`,
          type: 'color',
          value,
          action: actions.backColor(value),
        })),
      },
    ],
  },
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        id: `${DocumentCommandId.FORMAT_BLOCK}.blockquote`,
        type: 'icon',
        value: 'format-quote',
        action: actions.formatBlock('blockquote'),
      },
      {
        id: `${DocumentCommandId.FORMAT_BLOCK}.code`,
        type: 'icon',
        value: 'code',
        action: actions.formatBlock('code'),
      },
      {
        id: DocumentCommandId.INSERT_HORIZONTAL_RULE,
        type: 'icon',
        value: 'horizontal-rule',
        action: actions.insertHorizontalRule,
      },
    ],
  },
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        id: DocumentCommandId.INSERT_ORDERED_LIST,
        type: 'icon',
        value: 'format-list-numbered',
        action: actions.orderedList,
      },
      {
        id: DocumentCommandId.INSERT_UNORDERED_LIST,
        type: 'icon',
        value: 'format-list-bulleted',
        action: actions.unorderedList,
      },
    ],
  },
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        id: DocumentCommandId.INDENT,
        type: 'icon',
        value: 'format-indent-increase',
        action: actions.indent,
      },
      {
        id: DocumentCommandId.OUTDENT,
        type: 'icon',
        value: 'format-indent-decrease',
        action: actions.outdent,
      },
      {
        type: 'icon',
        defaultValue: 'format-align-left',
        items: [
          {
            id: DocumentCommandId.JUSTIFY_LEFT,
            type: 'icon',
            value: 'format-align-left',
            action: actions.justifyLeft,
          },
          {
            id: DocumentCommandId.JUSTIFY_CENTER,
            type: 'icon',
            value: 'format-align-center',
            action: actions.justifyCenter,
          },
          {
            id: DocumentCommandId.JUSTIFY_RIGHT,
            type: 'icon',
            value: 'format-align-right',
            action: actions.justifyRight,
          },
          {
            id: DocumentCommandId.JUSTIFY_FULL,
            type: 'icon',
            value: 'format-align-justify',
            action: actions.justifyFull,
          },
        ],
      },
    ],
  },
  {
    type: 'container',
    containerStyle: { flexDirection: 'row' },
    items: [
      {
        type: 'icon',
        value: 'link',
        items: [
          {
            type: 'custom',
            Component: () => {
              const { dispatch, data } = useToolbar();
              const { state } = data?.[DocumentCommandId.CREATE_LINK] ?? {};

              return createElement(ToolbarForm, {
                id: DocumentCommandId.CREATE_LINK,
                defaultValue: (state || '') as string,
                onSubmit: (href) => dispatch(actions.createLink(href)),
                pattern:
                  /^(https?:\/\/)(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d{2,5})?(?:\/[^\s]*)?$/,
                iconName: 'check',
                placeholder: 'URL',
              });
            },
          },
        ],
      },
    ],
  },
];
