import { type DocumentCommand } from 'react-native-lite-text-editor';

export default class InsertCode implements DocumentCommand {
  readonly id = 'insertCode';
  readonly name = 'PRE';

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
        anchorNode.nodeName === this.name
      ) {
        return true;
      }

      anchorNode = anchorNode?.parentNode ?? null;
    }

    return false;
  }

  exec() {
    const flag = document.execCommand(
      'formatBlock',
      false,
      '<' + this.name + '>'
    );
    const { anchorNode } = document.getSelection() ?? {};

    const targetNode = [anchorNode, anchorNode?.parentNode].find(
      (node) => node?.nodeName === this.name
    );

    if (targetNode instanceof HTMLElement) {
      const code = document.createElement('code');
      code.innerHTML = targetNode.innerHTML;
      targetNode.innerHTML = code.outerHTML;
    }

    return flag;
  }
}
