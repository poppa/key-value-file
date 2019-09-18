import { Token, TokenType } from './token'

export class KeyValue {
  private _tokens: Token[] = []

  constructor(tokens?: Token[]) {
    if (tokens) {
      this._tokens = tokens
    }
  }

  public get(key: string) {
    const t = this.getValueForKey(key)
    return t && t.value
  }

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

  public rename(key: string, newName: string) {
    const t = this.getKey(key)

    if (t) {
      t.value = newName
    }

    return this
  }

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

  public toString(collapseWhitespace = false) {
    const tokens = collapseWhitespace
      ? this.collapseWhitespace()
      : this._tokens

    return tokens.map((t) => t.value).join('')
  }

  protected addNewlineBeforeNewValue() {
    if (!this._tokens.length) {
      return false
    }

    const last = this._tokens[this._tokens.length - 1]
    return last.type !== TokenType.Newline
  }

  protected getKey(key: string) {
    return this._tokens.find(
      (t) => t.type === TokenType.Key && t.value === key)
  }

  protected getKeyIndex(key: string) {
    return this._tokens.findIndex((val) => {
      return val.type === TokenType.Key && val.value === key
    })
  }

  protected collapseWhitespace() {
    return this._tokens.filter((t) => {
      return t.type === TokenType.Newline || t.type !== TokenType.Whitespace
    })
  }

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
