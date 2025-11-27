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
