import type { DocumentCommand } from '../../types';

interface StorageData {
  commands: Map<string, DocumentCommand>;
  longPress?: {
    timeStamp: number;
    timerId: number;
  };
}

export class Storage<
  T extends object = StorageData,
  K extends keyof T = keyof T
> {
  private data: Partial<T>;

  constructor(initialValues?: Partial<T>) {
    this.data = initialValues ?? {};
  }

  get length() {
    return Object.keys(this.data).length;
  }

  key(index: number) {
    return Object.keys(this.data)[index] ?? null;
  }

  getItem<P extends K>(key: P) {
    return this.data[key] ?? null;
  }

  setItem<P extends K>(key: P, value: T[P]) {
    this.data[key] = value;
  }

  removeItem<P extends K>(key: P) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}
