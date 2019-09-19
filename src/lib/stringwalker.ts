export class StringWalker {
  protected data: string
  protected len: number
  protected cursor: number

  constructor(data: string | Buffer, normalizeWhiteSpace = false) {
    if (data instanceof Buffer) {
      data = data.toString('utf8')
    }

    if (normalizeWhiteSpace) {
      data = data.replace('\r\n', '\n').replace('\r', '\n')
    }

    this.data = data
    this.len = this.data.length
    this.cursor = 0
  }

  public get position() {
    return this.cursor
  }

  public get length() {
    return this.len
  }

  public isEof() {
    return this.cursor >= this.len
  }

  public next() {
    if (this.cursor + 1 > this.len) {
      return NaN
    }

    this.cursor += 1
    return this.data.charCodeAt(this.cursor)
  }

  public nextChar() {
    if (this.cursor + 1 > this.len) {
      return undefined
    }

    this.cursor += 1
    return this.data.charAt(this.cursor)
  }

  public current() {
    return this.data.charCodeAt(this.cursor)
  }

  public currentChar() {
    return this.data.charAt(this.cursor)
  }

  public peek(n = 1) {
    if (this.cursor + n >= this.len) {
      return NaN
    }

    return this.data.charCodeAt(this.cursor + n)
  }

  public peekChar(n = 1) {
    if (this.cursor + n >= this.len) {
      return undefined
    }

    return this.data.charAt(this.cursor + n)
  }

  public behind(n = 1) {
    n = n || 1

    if (this.cursor - n < 0) {
      return NaN
    }

    return this.data.charCodeAt(this.cursor - n)
  }

  public behindChar(n = 1) {
    n = n || 1

    if (this.cursor - n < 0) {
      return undefined
    }

    return this.data.charAt(this.cursor - n)
  }

  public findNext(char: string | number) {
    if (typeof char === 'string') {
      if (char.length > 1) {
        throw new Error('findNext() expected a single character')
      }

      char = char.charCodeAt(0)
    }

    let i = this.cursor + 1

    do {
      const k = this.data.charCodeAt(i)

      if (k === char) {
        return i
      }

      i += 1
    } while (i < this.len)

    return NaN
  }

  public findNextOf(chars: Array<string | number>) {
    const x = chars.map((c) => {
      if (typeof c === 'string') {
        if (c.length > 1) {
          throw new Error(`findNextOf() expects single characters, got ${c}`)
        }

        return c.charCodeAt(0)
      }

      return c
    })

    let i = this.cursor + 1

    do {
      const k = this.data.charCodeAt(i)

      if (x.includes(k)) {
        return i
      }

      i += 1
    } while (i < this.length)

    return NaN
  }

  public moveBy(steps: number) {
    this.assertSaneStart(this.cursor + steps)
    this.assertSaneEnd(this.cursor + steps)
    this.cursor += steps
    return this
  }

  public moveTo(to: number) {
    this.assertSaneStart(to)
    this.assertSaneEnd(to)
    this.cursor = to
    return this
  }

  public at(pos: number) {
    return this.data.charCodeAt(pos)
  }

  public charAt(pos: number) {
    return this.data.charAt(pos)
  }

  public consume(char: string | number | string[] | number[]) {
    if (!Array.isArray(char)) {
      if (typeof char === 'string') {
        char = char.charCodeAt(0)
      }

      char = [char]
    }

    const chars = (char as Array<string | number>).map((c) => {
      return typeof c === 'string' ? c.charCodeAt(0) : c
    })

    const d = this.data

    while (chars.includes(d.charCodeAt(this.cursor))) {
      this.cursor += 1

      if (this.isEof()) {
        break
      }
    }

    return this
  }

  public rewind() {
    this.cursor = 0
    return this
  }

  public substring(from: number, to?: number) {
    if (!to) {
      to = this.length
    }

    if (from > to) {
      throw new Error(`from (${from}) can to be greater than (${to})`)
    }

    this.assertSaneStart(from)
    this.assertSaneEnd(to)

    return this.data.substring(from, to)
  }

  protected assertSaneStart(n: number) {
    if (n < 0) {
      throw new Error(`Start position ${n} is less than zero`)
    }
  }

  protected assertSaneEnd(n: number) {
    if (n > this.len) {
      throw new Error(`End position ${n} is greater than the string length ${
        this.len}`)
    }
  }
}
