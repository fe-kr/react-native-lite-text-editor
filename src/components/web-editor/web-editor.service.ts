import * as BaseCommands from './commands/base-commands';
import { InsertStyle } from './commands/insert-style';
import { SetAttribute } from './commands/set-attribute';
import { Focus } from './commands/focus';
import { DocumentCommand } from './commands/command';
import type { EditorStorage } from './web-editor.storage';
import type {
  CommandsInfo,
  Constructor,
  EditorTransferObject,
  HTMLElementInfo,
} from '../../types';

export class EditorService {
  constructor(
    private view: HTMLElement,
    private storage: EditorStorage,
    private options: EditorTransferObject
  ) {
    const commands: Record<string, DocumentCommand> = {};
    const groupedCommands = Object.groupBy(this.options.commands, (id) => id);

    Object.values(BaseCommands).forEach((Command) => {
      const command = this.createCommand(Command)!;

      if (!this.options.commands.length || command.id in groupedCommands) {
        commands[command.id] = command;
      }
    });

    [InsertStyle, SetAttribute, Focus, ...this.options.extraCommands].forEach(
      (Command) => {
        const command = this.createCommand(Command);

        if (!command) return;

        commands[command.id] = command;
      }
    );

    this.storage.setItem('commands', new Map(Object.entries(commands)));
  }

  createCommand = (Command: unknown) => {
    if (typeof Command !== 'function') return;

    return new (Command as Constructor<DocumentCommand>)(this.view);
  };

  queryCommands = () => {
    const data = {} as CommandsInfo;

    this.storage.getItem('commands')?.forEach((command, key) => {
      data[key] = {
        state: command.queryState(),
        enabled: command.queryEnabled(),
      };
    });

    return data;
  };

  getElementAttributes = (e: Event) => {
    if (!(e.target instanceof HTMLElement)) return null;

    return {
      ...e.target.getAttributeNames().reduce<Record<any, any>>((acc, name) => {
        acc[name] = (e.target as HTMLElement)[name as keyof HTMLElement];

        return acc;
      }, {}),
      ...e.target.getBoundingClientRect(),
      tagName: e.target.tagName,
    } as unknown as HTMLElementInfo;
  };
}
