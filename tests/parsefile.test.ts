import 'jest'
import { join } from 'path'
import { parseFile } from '../src/lib/methods'
import { KeyValueFile } from '../src/lib/keyvaluefile'

describe('Test parseFile() method', () => {
  test('Expect parseFile() to load existing file', async () => {
    const kvfile = join(__dirname, 'test1.env')
    const kv = await parseFile(kvfile)

    expect(kv).toBeInstanceOf(KeyValueFile)
    expect(kv.get('key5')).toEqual('hello')
  })

  test('Expect parseFile() to throw on non-existing file', async () => {
    const t = () => parseFile('i-do-not-exist')
    // tslint:disable-next-line: no-floating-promises
    expect(t()).rejects.toThrow(/ENOENT/)
  })
})
