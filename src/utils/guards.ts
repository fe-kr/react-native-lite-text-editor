export const isString = (value: unknown) => {
  return typeof value === 'string';
};

export const isFunction = (value: unknown) => {
  return typeof value === 'function';
};

export const isBoolean = (value: unknown) => {
  return typeof value === 'boolean';
};

export const isNil = (value: unknown) => {
  return value === null || value === undefined;
};

export const isObject = (value: unknown) => {
  return typeof value === 'object' && !!value;
};

export const isActionLike = <T>(value: unknown): value is T => {
  return isObject(value) && 'type' in value && isString(value.type);
};
