import { Tokenizer } from './tokenizer'

export function tokenize(data: string | Buffer) {
  return new Tokenizer(data).tokenize()
}
