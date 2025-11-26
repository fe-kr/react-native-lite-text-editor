import { EditorEvent } from '../../config/enum';

export const debounce = <F extends (...args: any[]) => void>(
  func: F,
  wait: number
) => {
  let timeoutId: number | null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(
      () => func.apply(this, args),
      wait
    ) as unknown as number;
  };
};

export const postMessage = <T extends string, P>(type: T, payload: P) => {
  const message = JSON.stringify({ type, payload });

  window.ReactNativeWebView?.postMessage(message);
};

export const log = <P>(data: P) => {
  if (!window.RNLTE.__DEV__ || window.RNLTE.platformOS === 'web') return;

  setTimeout(() => {
    postMessage<string, string>(EditorEvent.LOG, JSON.stringify(data));
  });
};
