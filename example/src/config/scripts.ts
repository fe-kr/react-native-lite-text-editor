// @ts-ignore
import extraCommands from '../commands-js';

export const injectedJsBeforeContentLoaded = [
  `window.RNLTE.extraCommands = [${extraCommands}]`,
].join(';');
