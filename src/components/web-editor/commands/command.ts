import { type DocumentCommand as Command } from '../../../types';

export abstract class DocumentCommand implements Command {
  abstract id: string;

  queryState(): string | boolean {
    return document.queryCommandState(this.id);
  }

  queryValue() {
    return document.queryCommandValue(this.id);
  }

  queryEnabled() {
    return document.queryCommandEnabled(this.id);
  }

  exec(value?: unknown) {
    return document.execCommand(this.id, false, value?.toString());
  }
}
