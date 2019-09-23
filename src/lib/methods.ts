import { PathLike } from "fs"
import { tokenize } from './tokenize'
import { KeyValue } from './keyvalue'
import { KeyValueFile } from './keyvaluefile'

export async function parseFile(path: PathLike) {
  return KeyValueFile.create(path)
}

export function parseString(data: string | Buffer) {
  return new KeyValue(tokenize(data))
}
