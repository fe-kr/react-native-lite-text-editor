import type { PlatformOSType } from 'react-native';
import type { DocumentCommandConstructor } from './src/types';

declare global {
  interface Window {
    RNLTE: {
      __DEV__: boolean;
      platformOS: PlatformOSType;
      extraCommands: DocumentCommandConstructor[];
    };
    ReactNativeWebView: {
      postMessage: (message: string) => void;
      injectedObjectJson: () => string;
    };
  }
}

export {};
