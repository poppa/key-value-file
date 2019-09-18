import 'jest'
import { tokenize } from '../lib/tokenize'
import { TokenType } from '../lib/token'

describe('Test tokenizer', () => {
  test('Expect tokenize() to handle keys preceeded by whitespace', () => {
    const data = ' \tkey=value'
    const tokens = tokenize(data)
    expect(tokens.length).toBe(5)
    expect(tokens[2].type).toBe(TokenType.Key)
  })

  test(
    'Expect tokenize() to handle keys preceeded by whitespace after newline',
    () => {
      const data = '\n \tkey=value'
      const tokens = tokenize(data)
      expect(tokens.length).toBe(6)
      expect(tokens[3].type).toBe(TokenType.Key)
    }
  )

  test('Expect key to be followed by = then a value node', () => {
    const data = 'key=value'
    const tokens = tokenize(data)
    expect(tokens.length).toBe(3)
    expect(tokens[0].type).toBe(TokenType.Key)
    expect(tokens[0].value).toEqual('key')
    expect(tokens[1].type).toBe(TokenType.Delimiter)
    expect(tokens[1].value).toEqual('=')
    expect(tokens[2].type).toBe(TokenType.Value)
    expect(tokens[2].value).toEqual('value')
  })

  test('Expect first token to be a comment token', () => {
    const data = '# this is a comment'
    const tokens = tokenize(data)
    expect(tokens.length).toBe(1)
    expect(tokens[0].type).toBe(TokenType.Comment)
    expect(tokens[0].value).toEqual(data)
  })

  test(
    'Expect that whitespaces are handled between key, delimiter and value',
    () => {
      const data = 'key \t=   value\n'
      const tokens = tokenize(data)
      expect(tokens.length).toBe(9)
      expect(tokens[1].value).toEqual(' ')
      expect(tokens[2].value).toEqual('\t')
      expect(tokens[4].value).toEqual(' ')
      expect(tokens[5].value).toEqual(' ')
      expect(tokens[6].value).toEqual(' ')
      expect(tokens[7].type).toBe(TokenType.Value)
      expect(tokens[7].value).toEqual('value')
      expect(tokens[8].type).toBe(TokenType.Newline)
    }
  )
})
