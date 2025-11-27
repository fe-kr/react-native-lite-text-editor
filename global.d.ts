import type { RNLTE, ReactNativeWebView } from './src/types';

declare global {
  interface Window {
    RNLTE: RNLTE;
    ReactNativeWebView: ReactNativeWebView;
  }
}

export {};
