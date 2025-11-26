import extraCommands from '../../generated/commands';

export const injectedJsBeforeContentLoaded = [
  `window.RNLTE.extraCommands = [${extraCommands}]`,
].join(';');
