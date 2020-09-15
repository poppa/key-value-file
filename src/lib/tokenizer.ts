import { StringWalker } from 'string-walker'
import { Token, TokenType } from './token'

export class Tokenizer extends StringWalker {
  private _tokens: Token[] = []
  private spaceAndTab = [9, 32]

  constructor(data: string | Buffer) {
    super(data, true)
  }

  public get tokens(): Token[] {
    return this._tokens
  }

  public tokenize(): Token[] {
    while (!this.isEof()) {
      this.readKey()
    }

    return this._tokens
  }

  protected eatWhitespace(): void {
    if (!this.isEof()) {
      const start = this.cursor
      this.eatNewline()
      this.eatSpacesAndTabs()

      if (start !== this.cursor) {
        this.eatWhitespace()
      }
    }
  }

  protected eatNewline(): void {
    while (!this.isEof() && this.isNewline()) {
      this.pushCurrentToken(TokenType.Newline)
      this.next()
    }
  }

  protected eatSpacesAndTabs(): void {
    while (!this.isEof() && this.isSpaceOrTab()) {
      this.pushCurrentToken(TokenType.Whitespace)
      this.next()
    }
  }

  protected pushToken(type: TokenType, value: string): void {
    this._tokens.push({ type, value })
  }

  protected pushCurrentToken(type: TokenType): void {
    this._tokens.push({ type, value: this.currentChar() })
  }

  protected readKey(): void {
    this.eatWhitespace()
    this.readComment()

    if (this.isEof()) {
      return
    }

    let endpos = NaN

    if (this.isQuoteChar()) {
      endpos = this.findStringEnd()
    } else {
      endpos = this.findNextOf([' ', '\t', '='])
    }

    if (isNaN(endpos)) {
      throw new Error('Syntax error')
    }

    const key = this.substring(this.cursor, endpos)

    this.pushToken(TokenType.Key, key)
    this.moveTo(endpos)
    this.eatSpacesAndTabs()

    if (this.currentChar() !== '=') {
      throw new Error(`Expected "=" after key, got "${this.currentChar()}"`)
    }

    this.pushCurrentToken(TokenType.Delimiter)
    this.next()
    this.readValue()
  }

  protected readValue(): void {
    this.eatSpacesAndTabs()

    if (this.isEof() || this.isNewline()) {
      this.pushToken(TokenType.Value, '')
      this.next()
    } else if (this.isCommentStart()) {
      this.pushToken(TokenType.Value, '')
      this.readComment()
    } else {
      let endpos = this.len

      if (this.isQuoteChar()) {
        endpos = this.findStringEnd()
      } else {
        endpos = this.findNextOf(['#', '\n'])
      }

      if (isNaN(endpos)) {
        endpos = this.len
      }

      if (this.isCommentStart(endpos)) {
        // Early exit
        return this.handleTrailingComment(endpos)
      }

      const val = this.substring(this.cursor, endpos)
      this.pushToken(TokenType.Value, val)
      this.moveTo(endpos)
      this.readComment()
    }
  }

  protected isQuoteChar(n = 0): boolean {
    return [34, 39].includes(n ? this.at(n) : this.current())
  }

  protected isCommentStart(n = 0): boolean {
    return (n ? this.at(n) : this.current()) === 35
  }

  protected isNewline(n = 0): boolean {
    return (n ? this.at(n) : this.current()) === 10
  }

  protected isSpaceOrTab(n = 0): boolean {
    return this.spaceAndTab.includes(n ? this.at(n) : this.current())
  }

  protected findStringEnd(): number {
    if (!this.isQuoteChar()) {
      throw new Error(
        `Expected current charachter to be ' or ", got ${this.currentChar()}`
      )
    }

    const endpos = this.findNext(this.current())

    if (isNaN(endpos)) {
      throw new Error(`Unterminated string literal`)
    }

    return endpos + 1
  }

  protected handleTrailingComment(endpos: number): void {
    const prev = this.cursor
    this.moveTo(endpos)

    if (this.spaceAndTab.includes(this.behind())) {
      let offset = 1

      while (this.spaceAndTab.includes(this.behind(offset))) {
        offset += 1
      }

      const newEndPos = endpos - offset + 1
      const value = this.substring(prev, newEndPos)

      this.pushToken(TokenType.Value, value)
      this.moveTo(newEndPos)
      this.eatSpacesAndTabs()
      this.readComment()
    }
  }

  protected readComment(): void {
    if (this.isCommentStart()) {
      let endpos = this.findNext('\n')

      if (isNaN(endpos)) {
        endpos = this.len
      }

      const comment = this.substring(this.cursor, endpos)

      this.pushToken(TokenType.Comment, comment)
      this.moveTo(endpos)
      this.eatWhitespace()
    }
  }
}
