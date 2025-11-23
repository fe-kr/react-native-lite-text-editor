export const logger = <T>(data: T, level: 'log' | 'warn' | 'error' = 'log') => {
  if (process.env.NODE_ENV === 'development') {
    console[level](data);
  }
};
