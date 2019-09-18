export enum TokenType {
  None,
  Key,
  Value,
  Whitespace,
  Newline,
  Delimiter,
  Comment,
}

export interface Token {
  type: TokenType
  value: string
}
