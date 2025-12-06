import { InnerDocumentCommandId } from '../../../config/enum';
import type { DocumentCommand } from '../../../types';

export class Focus implements DocumentCommand {
  readonly id = InnerDocumentCommandId.FOCUS;

  constructor(private view: HTMLElement) {}

  queryState() {
    return false;
  }

  queryValue() {
    return '';
  }

  queryEnabled() {
    return true;
  }

  exec(position?: 'start' | 'end') {
    if (position === 'end') {
      const selection = document.getSelection();
      selection?.selectAllChildren(this.view);
      selection?.collapseToEnd();
    }

    return true;
  }
}
