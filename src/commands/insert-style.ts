import { InnerDocumentCommandId } from '../config/enum';
import type { DocumentCommand } from './command';

export class InsertStyle implements DocumentCommand {
  readonly id = InnerDocumentCommandId.INSERT_STYLE;

  queryState() {
    return false;
  }

  queryValue() {
    return '';
  }

  queryEnabled() {
    return true;
  }

  querySupported() {
    return true;
  }

  exec(content?: string) {
    if (!content) return false;

    document.head.querySelector('#rnlte-style')?.remove();

    const style = document.createElement('style');

    style.id = 'rnlte-style';
    style.textContent = content;

    return !!document.head.appendChild(style);
  }
}
