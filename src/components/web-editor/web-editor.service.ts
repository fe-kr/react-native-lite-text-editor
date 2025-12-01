import * as BaseCommands from './commands/base-commands';
import { InsertStyle } from './commands/insert-style';
import { SetAttribute } from './commands/set-attribute';
import { DocumentCommand } from './commands/command';
import type {
  CommandsInfo,
  Constructor,
  EditorTransferObject,
  HTMLElementInfo,
} from '../../types';

export class EditorService {
  commands: Map<string, DocumentCommand>;

  constructor(
    private view: HTMLElement,
    private options: EditorTransferObject
  ) {
    this.commands = new Map();

    const baseCommands = Object.values(BaseCommands);
    const groupedCommands = Object.groupBy(this.options.commands, (id) => id);

    baseCommands.forEach((Command) => {
      const command = this.createCommand(Command)!;

      if (!this.options.commands.length || command.id in groupedCommands) {
        this.setCommand(command);
      }
    });

    [InsertStyle, SetAttribute, ...this.options.extraCommands].forEach(
      (Cmd) => {
        const command = this.createCommand(Cmd);

        this.setCommand(command);
      }
    );
  }

  createCommand = (Command: unknown) => {
    if (typeof Command !== 'function') return;

    return new (Command as Constructor<DocumentCommand>)(this.view);
  };

  setCommand = (command?: DocumentCommand) => {
    if (!command) return;

    this.commands.set(command.id, command);
  };

  queryCommands = () => {
    const data = {} as CommandsInfo;

    this.commands.forEach((command, key) => {
      data[key] = {
        state: command.queryState(),
        enabled: command.queryEnabled(),
      };
    });

    return data;
  };

  getElementAttributes = (e: Event): HTMLElementInfo | null => {
    if (!(e.target instanceof HTMLElement)) return null;

    const tagName = e.target.tagName;
    const attributeNames = e.target.getAttributeNames();

    const { x, y, width, height } = e.target.getBoundingClientRect();

    const data = attributeNames.reduce((acc, name) => {
      acc[name] = (e.target as HTMLElement)?.[name as keyof HTMLElement];

      return acc;
    }, {} as Record<string, unknown>);

    return { ...data, x, y, width, height, tagName } as HTMLElementInfo;
  };
}
