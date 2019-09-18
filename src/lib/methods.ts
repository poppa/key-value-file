import { PathLike } from "fs"
import { readFile } from './fs'
import { tokenize } from './tokenize'
import { KeyValue } from './keyvalue'
import { KeyValueFile } from './keyvaluefile'

export async function parseFile(path: PathLike) {
  const data = await readFile(path)
  return new KeyValueFile(path, tokenize(data))
}

export function parseString(data: string | Buffer) {
  return new KeyValue(tokenize(data))
}
