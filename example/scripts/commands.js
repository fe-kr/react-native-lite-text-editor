import { transpileModule, ModuleKind } from 'typescript';
import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const inputPath = 'src/commands';
const outputPath = inputPath + '-js';
const indexRegExp = /^index\.ts$/;
const defaults = 'export default ';
const compilerOptions = {
  module: ModuleKind.ES2020,
  target: 'ES2019',
};

mkdirSync(outputPath, { recursive: true });

readdirSync(inputPath).forEach((file) => {
  const tsSourceCode = readFileSync(join(inputPath, file), 'utf8');
  const result = transpileModule(tsSourceCode, { compilerOptions });
  const outputFile = join(outputPath, basename(file, '.ts') + '.js');
  let outputText = result.outputText;

  if (!indexRegExp.test(file)) {
    outputText = `${defaults}\`${result.outputText.replace(defaults, '')}\`;`;
  }

  writeFileSync(outputFile, outputText, 'utf8');

  console.log(`Transpiled ${file} → ${outputFile}`);
});
