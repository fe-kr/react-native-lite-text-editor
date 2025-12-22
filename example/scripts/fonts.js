import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const inputPath = resolve(
  resolve(),
  './node_modules/@expo-google-fonts/lato/400Regular/Lato_400Regular.ttf'
);
const outputPath = resolve(resolve(), './generated/fonts');

mkdirSync(outputPath, { recursive: true });

const base64 = readFileSync(inputPath).toString('base64');

const tsContent = `export default \`${base64}\`;\n`;

writeFileSync(join(outputPath, 'base64.ts'), tsContent, { encoding: 'utf8' });
console.log(`Wrote ${outputPath} (base64 length: ${base64.length})`);
