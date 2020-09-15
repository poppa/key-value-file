import { PathLike } from 'fs'
import { tokenize } from './tokenize'
import { KeyValue } from './keyvalue'
import { KeyValueFile } from './keyvaluefile'
import { exists } from './fs'

/**
 * Create a {@link KeyValueFile} instance from the file of `path`
 */
export async function parseFile(path: PathLike): Promise<KeyValueFile> {
  if (!(await exists(path))) {
    throw new Error(`ENOENT, no such file or directory '${path}'`)
  }

  return KeyValueFile.create(path)
}

/**
 * Create a {@link KeyValue} instance from the string `data`
 */
export function parseString(data: string | Buffer): KeyValue {
  return new KeyValue(tokenize(data))
}
