import { Token } from './token'
import { Tokenizer } from './tokenizer'

export function tokenize(data: string | Buffer): Token[] {
  return new Tokenizer(data).tokenize()
}
