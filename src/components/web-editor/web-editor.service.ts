import * as BaseCommands from './commands/base-commands';
import { InsertStyle } from './commands/insert-style';
import { SetAttribute } from './commands/set-attribute';
import type {
  CommandsInfo,
  DocumentCommand,
  DocumentCommandConstructor,
  EditorTransferObject,
  HTMLElementInfo,
} from '../../types';

export class EditorService {
  commands: Map<string, DocumentCommand>;

  constructor(
    private view: HTMLElement,
    private options: EditorTransferObject | null
  ) {
    this.commands = new Map();

    this.setCommands();
  }

  setCommands() {
    const commands = Object.values(BaseCommands);

    const extraCommands =
      this.options?.extraCommands.map<DocumentCommandConstructor>(
        // eslint-disable-next-line no-new-func
        (str) => new Function(`return ${str}`)()
      ) ?? [];

    [...commands, ...extraCommands, InsertStyle, SetAttribute].forEach(
      (Command) => {
        const command = new Command(this.view);

        this.commands.set(command.id, command);
      }
    );

    this.options?.commands.forEach((id) => {
      if (!this.commands.has(id)) return;

      this.commands.delete(id);
    });
  }

  queryCommands() {
    const data = {} as CommandsInfo;

    this.commands.forEach((command, key) => {
      data[key] = {
        state: command.queryState(),
        enabled: command.queryEnabled(),
      };
    });

    return data;
  }

  getElementAttributes(e: Event): HTMLElementInfo | null {
    if (!(e.target instanceof HTMLElement)) return null;

    const tagName = e.target.tagName;
    const attributeNames = e.target.getAttributeNames();

    const { x, y, width, height } = e.target.getBoundingClientRect();

    const data = attributeNames.reduce((acc, name) => {
      acc[name] = (e.target as HTMLElement)?.[name as keyof HTMLElement];

      return acc;
    }, {} as Record<string, unknown>);

    return { ...data, x, y, width, height, tagName } as HTMLElementInfo;
  }
}
