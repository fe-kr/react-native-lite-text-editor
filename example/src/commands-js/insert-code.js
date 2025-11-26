export default `class InsertCode {
    constructor(view) {
        this.view = view;
        this.id = 'insertCode';
        this.name = 'PRE';
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
                anchorNode.nodeName === this.name) {
                return true;
            }
            anchorNode = (_b = anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentNode) !== null && _b !== void 0 ? _b : null;
        }
        return false;
    }
    exec() {
        var _a;
        const flag = document.execCommand('formatBlock', false, '<' + this.name + '>');
        const { anchorNode } = (_a = document.getSelection()) !== null && _a !== void 0 ? _a : {};
        const targetNode = [anchorNode, anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentNode].find((node) => (node === null || node === void 0 ? void 0 : node.nodeName) === this.name);
        if (targetNode instanceof HTMLElement) {
            const code = document.createElement('code');
            code.innerHTML = targetNode.innerHTML;
            targetNode.innerHTML = code.outerHTML;
        }
        return flag;
    }
}
`;
