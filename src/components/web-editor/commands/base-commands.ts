import { DocumentCommand } from './command';
import { DocumentCommandId } from '../../../config/enum';
import type { HTMLElementTag } from '../../../types';

export class Bold extends DocumentCommand {
  readonly id = DocumentCommandId.BOLD;
}

export class Italic extends DocumentCommand {
  readonly id = DocumentCommandId.ITALIC;
}

export class Underline extends DocumentCommand {
  readonly id = DocumentCommandId.UNDERLINE;
}

export class StrikeThrough extends DocumentCommand {
  readonly id = DocumentCommandId.STRIKE_THROUGH;
}

export class Subscript extends DocumentCommand {
  readonly id = DocumentCommandId.SUBSCRIPT;
}

export class Superscript extends DocumentCommand {
  readonly id = DocumentCommandId.SUPERSCRIPT;
}

export class RemoveFormat extends DocumentCommand {
  readonly id = DocumentCommandId.REMOVE_FORMAT;
}

export class OrderedList extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_ORDERED_LIST;
}

export class UnorderedList extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_UNORDERED_LIST;
}

export class InsertHorizontalRule extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_HORIZONTAL_RULE;
}

export class Redo extends DocumentCommand {
  readonly id = DocumentCommandId.REDO;
}

export class Undo extends DocumentCommand {
  readonly id = DocumentCommandId.UNDO;
}

export class Indent extends DocumentCommand {
  readonly id = DocumentCommandId.INDENT;
}

export class Outdent extends DocumentCommand {
  readonly id = DocumentCommandId.OUTDENT;
}

export class JustifyLeft extends DocumentCommand {
  readonly id = DocumentCommandId.JUSTIFY_LEFT;
}

export class JustifyRight extends DocumentCommand {
  readonly id = DocumentCommandId.JUSTIFY_RIGHT;
}

export class JustifyCenter extends DocumentCommand {
  readonly id = DocumentCommandId.JUSTIFY_CENTER;
}

export class JustifyFull extends DocumentCommand {
  readonly id = DocumentCommandId.JUSTIFY_FULL;
}

export class ForeColor extends DocumentCommand {
  readonly id = DocumentCommandId.FORE_COLOR;

  queryState() {
    return super.queryValue();
  }
}

export class BackColor extends DocumentCommand {
  readonly id = DocumentCommandId.BACK_COLOR;

  queryState() {
    return super.queryValue();
  }
}

export class FontSize extends DocumentCommand {
  readonly id = DocumentCommandId.FONT_SIZE;

  queryState() {
    return super.queryValue();
  }
}

export class FontName extends DocumentCommand {
  readonly id = DocumentCommandId.FONT_NAME;

  queryState() {
    return super.queryValue();
  }
}

export class FormatBlock extends DocumentCommand {
  readonly id = DocumentCommandId.FORMAT_BLOCK;

  queryState() {
    return super.queryValue();
  }

  exec(value: HTMLElementTag) {
    return super.exec(`<${value}>`);
  }
}

export class InsertHtml extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_HTML;
}

export class InsertText extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_TEXT;
}

export class InsertImage extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_IMAGE;
}

export class Unlink extends DocumentCommand {
  readonly id = DocumentCommandId.UNLINK;
}

export class InsertParagraph extends DocumentCommand {
  readonly id = DocumentCommandId.INSERT_PARAGRAPH;
}

export class Copy extends DocumentCommand {
  readonly id = DocumentCommandId.COPY;
}

export class Cut extends DocumentCommand {
  readonly id = DocumentCommandId.CUT;
}

export class SelectAll extends DocumentCommand {
  readonly id = DocumentCommandId.SELECT_ALL;
}

export class Remove extends DocumentCommand {
  readonly id = DocumentCommandId.DELETE;
}

export class ForwardDelete extends DocumentCommand {
  readonly id = DocumentCommandId.FORWARD_DELETE;
}

export class DecreaseFontSize extends DocumentCommand {
  readonly id = DocumentCommandId.DECREASE_FONT_SIZE;
}

export class IncreaseFontSize extends DocumentCommand {
  readonly id = DocumentCommandId.INCREASE_FONT_SIZE;
}

export class DefaultParagraphSeparator extends DocumentCommand {
  readonly id = DocumentCommandId.DEFAULT_PARAGRAPH_SEPARATOR;
}

export class StyleWithCSS extends DocumentCommand {
  readonly id = DocumentCommandId.STYLE_WITH_CSS;
}

export class CreateLink extends DocumentCommand {
  readonly id = DocumentCommandId.CREATE_LINK;
}
