import { Token, TokenType } from './token'

/**
 * Class for manipulating key/value data (`.env` files f.ex)
 */
export class KeyValue {
  private _tokens: Token[] = []

  /**
   * Constructor
   * @param tokens {@see tokenize:tokenize|tokenize()}
   */
  constructor(tokens?: Token[]) {
    if (tokens) {
      this._tokens = tokens
    }
  }

  /**
   * Returns the value of key `key`
   * @param key The key to get the value for
   * @returns `undefined` if the `key` is not found
   */
  public get(key: string) {
    const t = this.getValueForKey(key)
    return t && t.value
  }

  /**
   * Set the value of key `key`. If the `key` doesn't exist it's created
   * @param key
   * @param value
   * @returns The instance being called
   */
  public set(key: string, value: string | number) {
    const t = this.getValueForKey(key)

    if (t) {
      t.value = `${value}`
    }
    else {
      if (this.addNewlineBeforeNewValue()) {
        this._tokens.push({ type: TokenType.Newline, value: '\n' })
      }

      this._tokens.push({ type: TokenType.Key, value: key })
      this._tokens.push({ type: TokenType.Delimiter, value: '=' })
      this._tokens.push({ type: TokenType.Value, value: `${value}` })
    }

    return this
  }

  /**
   * Rename the key `key` to `newName`
   * @param key The name of the key to rename
   * @param newName The new name of the key
   * @returns The instance being called
   */
  public rename(key: string, newName: string) {
    const t = this.getKey(key)

    if (t) {
      t.value = newName
    }

    return this
  }

  /**
   * Delete the key `key`
   * @param key The name of the key to delete
   * @returns The instance being called
   */
  public delete(key: string) {
    const k = this.getKeyIndex(key)

    if (k > -1) {
      const tokens = this._tokens
      let i = k + 1

      for (; i < tokens.length; i++) {
        const t = tokens[i]

        if (t.type === TokenType.Value) {
          break
        }
      }

      this._tokens.splice(k, i - k)
    }

    return this
  }

  /**
   * Add new newline token
   */
  public addNewline() {
    this._tokens.push({ type: TokenType.Newline, value: '\n' })
    return this
  }

  /**
   * Add a comment node.
   *
   * Note! The comment should not have a leading `#`.
   * The comment can be multi-line
   * @param comment
   */
  public addComment(comment: string) {
    comment = comment.split('\n').map((s) => `# ${s}`).join('\n')
    this._tokens.push({ type: TokenType.Comment, value: comment })
    return this
  }

  /**
   * Remove all comment tokens
   */
  public removeComments() {
    const tokens = this._tokens
    const newTokens: Token[] = []
    const rmLeadingWs = () => {
      const i = newTokens.length - 2

      if (newTokens[i] && newTokens[i].type === TokenType.Whitespace) {
        while (newTokens[i]) {
          if (newTokens[i].type === TokenType.Whitespace) {
            newTokens.splice(i, 1)
          }
        }
      }
    }

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === TokenType.Comment) {
        if (!this.isTrailingComment(i)) {
          if (tokens[i - 1] && tokens[i - 1].type === TokenType.Whitespace) {
            rmLeadingWs()
          }

          i += 1
        }

        continue
      }

      newTokens.push(tokens[i])
    }

    this._tokens = newTokens

    return this
  }

  /**
   * Stringify the tokens
   * @param collapseWhitespace If `true` all whitespaces, except newlines,
   * will be removed
   */
  public toString(collapseWhitespace = false) {
    const tokens = collapseWhitespace
      ? this.collapseWhitespace()
      : this._tokens

    return tokens.map((t) => t.value).join('')
  }

  /**
   * Check if the comment at `pos` is a trailing comment or not
   * @param pos
   */
  protected isTrailingComment(pos: number) {
    const tokens = this._tokens
    const c = tokens[pos]
    if (c.type !== TokenType.Comment) {
      throw new Error(`Expected a comment node, got ${c.type}`)
    }

    let i = pos - 1

    while (tokens[i]) {
      const t = tokens[i]
      i -= 1

      if (t.type === TokenType.Whitespace) {
        continue
      }
      else if (t.type === TokenType.Value) {
        return true
      }
      else if (t.type === TokenType.Newline) {
        return false
      }
    }

    return false
  }

  /**
   * Check if we need no add a newline before adding a new key/value pair
   */
  protected addNewlineBeforeNewValue() {
    if (!this._tokens.length) {
      return false
    }

    const last = this._tokens[this._tokens.length - 1]
    return last.type !== TokenType.Newline
  }

  /**
   * Get the key token with name `key`
   * @param key
   */
  protected getKey(key: string) {
    return this._tokens.find(
      (t) => t.type === TokenType.Key && t.value === key)
  }

  /**
   * Returns the index of the key token with name `key`
   * @param key
   */
  protected getKeyIndex(key: string) {
    return this._tokens.findIndex((val) => {
      return val.type === TokenType.Key && val.value === key
    })
  }

  /**
   * Remove all unnecessary whitespace tokens
   */
  protected collapseWhitespace() {
    const len = this._tokens.length - 1

    return this._tokens.filter((t, i) => {
      if ((this._tokens[i - 1]
        && this._tokens[i - 1].type === TokenType.Newline
        && t.type === TokenType.Newline)
        || (i === len
          && t.type === TokenType.Newline)
      ) {
        return false
      }

      return t.type === TokenType.Newline || t.type !== TokenType.Whitespace
    })
  }

  /**
   * Returns the value token for key `key`
   * @param key
   */
  protected getValueForKey(key: string) {
    const keyPos = this.getKeyIndex(key)
    const tokens = this._tokens

    if (keyPos > -1) {
      for (let i = keyPos + 1; i < tokens.length; i++) {
        const t = tokens[i]

        if (t.type === TokenType.Value) {
          return t
        }
      }
    }

    return undefined
  }
}
