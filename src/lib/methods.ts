import { PathLike } from "fs"
import { tokenize } from './tokenize'
import { KeyValue } from './keyvalue'
import { KeyValueFile } from './keyvaluefile'
import { exists } from './fs'

export async function parseFile(path: PathLike) {
  if (!await exists(path)) {
    throw new Error(`ENOENT, no such file or directory '${path}'`)
  }

  return KeyValueFile.create(path)
}

export function parseString(data: string | Buffer) {
  return new KeyValue(tokenize(data))
}
