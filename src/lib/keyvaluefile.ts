import { PathLike, WriteFileOptions } from 'fs'
import { KeyValue } from './keyvalue'
import { Token } from './token'
import { writeFile, exists, readFile } from './fs'
import { tokenize } from './tokenize'

/**
 * Read/write a key/value file
 */
export class KeyValueFile extends KeyValue {
  /** Returns the path of the key/value file */
  public get path(): PathLike {
    return this._path
  }

  /**
   * Creates an instance of {@link KeyValueFile}. If `path` exists it is
   * loaded.
   */
  public static async create(path: PathLike): Promise<KeyValueFile> {
    let tokens: Token[] | undefined

    if (await exists(path)) {
      const data = await readFile(path)
      tokens = tokenize(data)
    }

    return new this(path, tokens)
  }

  private _path: PathLike

  /**
   * Constructor
   *
   * @param path The path of the key/value file
   * @param tokens The tokens of the file {@see tokenize:tokenize()|tokenize()}
   */
  constructor(path: PathLike, tokens?: Token[]) {
    super(tokens)
    this._path = path
  }

  /**
   * Save the file to disk
   * @param collapseWhitespace If `true` all unnecessary whitespace will
   * be removed
   * @param options Options passed to {@link
   *  https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback | fs.writeFile}
   */
  public async writeFile(
    collapseWhitespace = false,
    options?: WriteFileOptions
  ): Promise<this> {
    const data = this.toString(collapseWhitespace)
    await writeFile(this._path, data, options)
    return this
  }
}
