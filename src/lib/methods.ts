import { PathLike } from "fs";
import { readFile } from './fs';
import { tokenize } from './tokenize';
import { KeyValue } from './keyvalue';
import { KeyValueFile } from './keyvaluefile';

export async function parseFile(path: PathLike) {
  const data = await readFile(path)
  const tokens = tokenize(data)
  return new KeyValueFile(path, tokens)
}

export function parseString(data: string | Buffer) {
  const tokens = tokenize(data)
  return new KeyValue(tokens)
}
