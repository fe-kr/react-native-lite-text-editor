import type { EditorTransferObject } from './src/types';

declare global {
  interface Window {
    RNLTE: EditorTransferObject;
  }
}

export {};
