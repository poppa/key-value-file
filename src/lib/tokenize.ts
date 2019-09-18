import { Token, TokenType } from './token'


export function tokenize(data: string | Buffer) {
  if (data instanceof Buffer) {
    data = data.toString('utf8')
  }

  const tokens: Token[] = []
  let len = data.length
  let i = 1
  let state: TokenType = TokenType.None
  let buffer = ''

  const pushBuffer = () => {
    if (buffer.length && state) {
      tokens.push({ type: state, value: buffer })
      buffer = ''
    }
  }

  const consumews = () => {
    return state === TokenType.Value || state === TokenType.Comment
  }

  const prev = () => {
    return (data as string).charCodeAt(i-1)
  }

  data = `\0${data}\0`

  while (i <= len) {
    const code = data.charCodeAt(i)
    const char = data.charAt(i)
    // console.log('-->', char, code)

    if (isnl(code)) {
      pushBuffer()
      tokens.push({ type: TokenType.Newline, value: char })
      state = TokenType.None
    }
    else if (isws(code) && !consumews()) {
      pushBuffer()
      tokens.push({ type: TokenType.Whitespace, value: char })
    }
    else if (isdelim(code)) {
      if (state !== TokenType.Key) {
        throw new Error('Syntax error')
      }

      if (!isws(prev())) {
        pushBuffer()
      }

      tokens.push({ type: TokenType.Delimiter, value: char })
      state = TokenType.Delimiter
    }
    // # = start of comment
    else if (code === 35) {
      pushBuffer()
      buffer += char
      state = TokenType.Comment
    }
    else {
      if (state === TokenType.None) {
        state = TokenType.Key
      }
      else if (state === TokenType.Delimiter) {
        state = TokenType.Value
      }

      buffer += char
    }

    i += 1
  }

  pushBuffer()

  return tokens
}

function isnl(char: number) {
  return [10].includes(char)
}

function isws(char: number) {
  return [9, 10, 13, 32].includes(char)
}

function isdelim(char: number) {
  return [61].includes(char)
}
