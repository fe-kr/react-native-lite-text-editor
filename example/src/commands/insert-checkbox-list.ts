import { type DocumentCommand } from 'react-native-lite-text-editor';

export class InsertCheckboxList implements DocumentCommand {
  readonly id = 'insertCheckboxList';
  readonly className = 'rnlte-checkbox';

  constructor(private view: HTMLElement) {}

  queryValue() {
    return '';
  }

  queryEnabled() {
    return document.activeElement === this.view;
  }

  queryState() {
    let { anchorNode } = document.getSelection() ?? {};

    while (anchorNode instanceof HTMLElement || !!anchorNode?.parentNode) {
      if (
        anchorNode instanceof HTMLElement &&
        anchorNode.classList.contains(this.className)
      ) {
        return true;
      }

      anchorNode = anchorNode?.parentNode ?? null;
    }

    return false;
  }

  exec() {
    const { anchorNode } = document.getSelection() ?? {};

    const item = this.createItem(anchorNode);
    const list = this.createList(item);

    return document.execCommand('insertHTML', false, list.outerHTML);
  }

  createItem(element?: Node | null) {
    const input = document.createElement('input');

    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', `${this.className}-input`);

    const item = document.createElement('dt');

    [input, element].filter(Boolean).forEach((node) => item.appendChild(node!));

    return item;
  }

  createList(element: HTMLElement) {
    const list = document.createElement('dl');

    list.setAttribute('class', this.className);

    list.appendChild(element);

    return list;
  }
}
