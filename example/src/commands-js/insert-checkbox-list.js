export default `class InsertCheckboxList {
    constructor(view) {
        this.view = view;
        this.id = 'insertCheckboxList';
        this.className = 'rnlte-checkbox';
    }
    queryValue() {
        return '';
    }
    queryEnabled() {
        return document.activeElement === this.view;
    }
    queryState() {
        var _a, _b;
        let { anchorNode } = (_a = document.getSelection()) !== null && _a !== void 0 ? _a : {};
        while (anchorNode instanceof HTMLElement || !!(anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentNode)) {
            if (anchorNode instanceof HTMLElement &&
                anchorNode.classList.contains(this.className)) {
                return true;
            }
            anchorNode = (_b = anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentNode) !== null && _b !== void 0 ? _b : null;
        }
        return false;
    }
    exec() {
        var _a;
        const { anchorNode } = (_a = document.getSelection()) !== null && _a !== void 0 ? _a : {};
        const item = this.createItem(anchorNode);
        const list = this.createList(item);
        return document.execCommand('insertHTML', false, list.outerHTML);
    }
    createItem(element) {
        const input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('class', this.className + '-input');
        const item = document.createElement('dt');
        [input, element].filter(Boolean).forEach((node) => item.appendChild(node));
        return item;
    }
    createList(element) {
        const list = document.createElement('dl');
        list.setAttribute('class', this.className);
        list.appendChild(element);
        return list;
    }
}
`;
