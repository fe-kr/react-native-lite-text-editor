import * as Commands from './base';
import { InsertStyle } from './insert-style';
import { SetAttribute } from './set-attribute';

export { DocumentCommand } from './command';
export default { ...Commands, SetAttribute, InsertStyle };
