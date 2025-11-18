import Commands from '../../commands';
import type { DocumentCommand } from '../../commands';
import type {
  CommandsInfo,
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

    this.setExtraCommands();
  }

  setCommands() {
    const { commands } = this.options ?? {};

    Object.values(Commands).forEach((Command) => {
      const command = new Command(this.view);

      if (commands && commands[0] !== '*' && !commands.includes(command.id))
        return;

      this.commands.set(command.id, command);
    });
  }

  setExtraCommands() {
    this.options?.extraCommands.forEach((str) => {
      // eslint-disable-next-line no-new-func
      const Command = new Function(
        `return ${str}`
      )() as DocumentCommandConstructor;

      const command = new Command(this.view);

      this.commands.set(command.id, command);
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
