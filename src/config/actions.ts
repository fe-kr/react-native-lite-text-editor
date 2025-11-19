import { InnerDocumentCommandId, DocumentCommandId } from './enum';
import type { Action, ActionCreator, HTMLElementTag } from '../types';

export const bold: Action = {
  type: DocumentCommandId.BOLD,
  meta: { focusable: true, selectable: true },
};

export const italic: Action = {
  type: DocumentCommandId.ITALIC,
  meta: { focusable: true, selectable: true },
};

export const underline: Action = {
  type: DocumentCommandId.UNDERLINE,
  meta: { focusable: true, selectable: true },
};

export const strikeThrough: Action = {
  type: DocumentCommandId.STRIKE_THROUGH,
  meta: { focusable: true, selectable: true },
};

export const subscript: Action = {
  type: DocumentCommandId.SUBSCRIPT,
  meta: { focusable: true, selectable: true },
};

export const superscript: Action = {
  type: DocumentCommandId.SUPERSCRIPT,
  meta: { focusable: true, selectable: true },
};

export const removeFormat: Action = {
  type: DocumentCommandId.REMOVE_FORMAT,
  meta: { focusable: true, selectable: true },
};

export const orderedList: Action = {
  type: DocumentCommandId.INSERT_ORDERED_LIST,
  meta: { focusable: true, selectable: true },
};

export const unorderedList: Action = {
  type: DocumentCommandId.INSERT_UNORDERED_LIST,
  meta: { focusable: true, selectable: true },
};

export const insertHorizontalRule: Action = {
  type: DocumentCommandId.INSERT_HORIZONTAL_RULE,
  meta: { focusable: true, selectable: true },
};

export const redo: Action = {
  type: DocumentCommandId.REDO,
  meta: { focusable: true, selectable: true },
};

export const undo: Action = {
  type: DocumentCommandId.UNDO,
  meta: { focusable: true, selectable: true },
};

export const indent: Action = {
  type: DocumentCommandId.INDENT,
  meta: { focusable: true, selectable: true },
};

export const outdent: Action = {
  type: DocumentCommandId.OUTDENT,
  meta: { focusable: true, selectable: true },
};

export const justifyLeft: Action = {
  type: DocumentCommandId.JUSTIFY_LEFT,
  meta: { focusable: true, selectable: true },
};

export const justifyRight: Action = {
  type: DocumentCommandId.JUSTIFY_RIGHT,
  meta: { focusable: true, selectable: true },
};

export const justifyCenter: Action = {
  type: DocumentCommandId.JUSTIFY_CENTER,
  meta: { focusable: true, selectable: true },
};

export const justifyFull: Action = {
  type: DocumentCommandId.JUSTIFY_FULL,
  meta: { focusable: true, selectable: true },
};

export const unlink: Action = {
  type: DocumentCommandId.UNLINK,
  meta: { focusable: true, selectable: true },
};

export const enableObjectResizing: Action = {
  type: DocumentCommandId.ENABLE_OBJECT_RESIZING,
  meta: { focusable: true, selectable: true },
};

export const focus: Action = {
  type: InnerDocumentCommandId.FOCUS,
  meta: { focusable: true },
};

export const select: Action = {
  type: InnerDocumentCommandId.SELECT,
  meta: { selectable: true },
};

export const copy: Action = {
  type: DocumentCommandId.COPY,
  meta: { focusable: true },
};

export const cut: Action = {
  type: DocumentCommandId.CUT,
  meta: { focusable: true, selectable: true },
};

export const remove: Action = {
  type: DocumentCommandId.DELETE,
  meta: { focusable: true, selectable: true },
};

export const increaseFontSize: Action = {
  type: DocumentCommandId.INCREASE_FONT_SIZE,
  meta: { focusable: true, selectable: true },
};

export const decreaseFontSize: Action = {
  type: DocumentCommandId.DECREASE_FONT_SIZE,
  meta: { focusable: true, selectable: true },
};

export const enableAbsolutePositionEditor: Action = {
  type: DocumentCommandId.ENABLE_ABSOLUTE_POSITION_EDITOR,
  meta: { focusable: true, selectable: true },
};

export const enableInlineTableEditing: Action = {
  type: DocumentCommandId.ENABLE_INLINE_TABLE_EDITING,
  meta: { focusable: true, selectable: true },
};

export const forwardDelete: Action = {
  type: DocumentCommandId.FORWARD_DELETE,
  meta: { focusable: true, selectable: true },
};

export const insertBrOnReturn: Action = {
  type: DocumentCommandId.INSERT_BR_ON_RETURN,
  meta: { focusable: true, selectable: true },
};

export const insertParagraph: Action = {
  type: DocumentCommandId.INSERT_PARAGRAPH,
  meta: { focusable: true, selectable: true },
};

export const paste: Action = {
  type: DocumentCommandId.PASTE,
  meta: { focusable: true, selectable: true },
};

export const selectAll: Action = {
  type: DocumentCommandId.SELECT_ALL,
  meta: { focusable: true, selectable: true },
};

export const styleWithCSS: Action = {
  type: DocumentCommandId.STYLE_WITH_CSS,
  meta: { focusable: true, selectable: true },
};

export const defaultParagraphSeparator: ActionCreator<HTMLElementTag> = (
  payload,
  meta
) => ({
  type: DocumentCommandId.DEFAULT_PARAGRAPH_SEPARATOR,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const formatBlock: ActionCreator<HTMLElementTag> = (payload, meta) => ({
  type: DocumentCommandId.FORMAT_BLOCK,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const foreColor: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.FORE_COLOR,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const backColor: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.BACK_COLOR,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const fontSize: ActionCreator<number> = (payload, meta) => ({
  type: DocumentCommandId.FONT_SIZE,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const fontName: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.FONT_NAME,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const insertImage: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.INSERT_IMAGE,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const createLink: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.CREATE_LINK,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const contentReadOnly: ActionCreator<boolean> = (payload, meta) => ({
  type: DocumentCommandId.CONTENT_READ_ONLY,
  payload,
  meta,
});

export const insertHTML: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.INSERT_HTML,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const insertText: ActionCreator<string> = (payload, meta) => ({
  type: DocumentCommandId.INSERT_TEXT,
  payload,
  meta: meta ?? { focusable: true, selectable: true },
});

export const insertStyle: ActionCreator<string> = (payload, meta) => ({
  type: InnerDocumentCommandId.INSERT_STYLE,
  payload,
  meta,
});

export const setAttribute: ActionCreator<Record<string, string | boolean>> = (
  payload,
  meta
) => ({
  type: InnerDocumentCommandId.SET_ATTRIBUTE,
  payload,
  meta,
});
