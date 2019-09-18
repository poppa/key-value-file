import { KeyValue } from './keyvalue'
import { PathLike } from 'fs'
import { Token } from './token'
import { writeFile } from './fs'

export class KeyValueFile extends KeyValue {
  private _path: PathLike

  constructor(path: PathLike, tokens?: Token[]) {
    super(tokens)
    this._path = path
  }

  public get path() {
    return this._path
  }

  public async writeFile(collapseWhitespace = false) {
    const data = this.toString(collapseWhitespace)
    return writeFile(this._path, data)
  }
}
