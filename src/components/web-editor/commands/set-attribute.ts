import { InnerDocumentCommandId } from '../../../config/enum';
import type { DocumentCommand } from '../../../config/command';

export class SetAttribute implements DocumentCommand {
  readonly id = InnerDocumentCommandId.SET_ATTRIBUTE;

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

  querySupported() {
    return true;
  }

  exec(values: Record<string, string>) {
    for (const key in values) {
      if (key === 'innerHTML') {
        this.view.innerHTML = values[key] ?? '';
      } else {
        this.view.setAttribute(key, values[key] ?? '');
      }
    }

    return true;
  }
}
