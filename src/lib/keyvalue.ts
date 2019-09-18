import { Token, TokenType } from './token';

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

  public toString(collapseWhitespace = false) {
    const tokens = collapseWhitespace
      ? this.collapseWhitespace()
      : this._tokens

    return tokens.map((t) => t.value).join('')
  }

  protected getKey(key: string) {
    return this._tokens.find(
      (t) => t.type === TokenType.Key && t.value === key)
  }

  protected collapseWhitespace() {
    return this._tokens.filter((t) => {
      return t.type === TokenType.Newline || t.type !== TokenType.Whitespace
    })
  }

  protected getValueForKey(key: string) {
    const tokens = this._tokens
    for (let i = 0; i < tokens.length; i++) {
      let t = tokens[i]

      if (t.type === TokenType.Key && t.value === key) {
        do {
          t = tokens[++i]

          if (t.type === TokenType.Value) {
            return t
          }
        } while (i < tokens.length)
      }
    }

    return undefined
  }
}
