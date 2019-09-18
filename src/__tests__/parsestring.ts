import 'jest'
import { parseString } from '../lib/methods'

describe('Test parseString()', () => {
  test('Expect parseString() to work with plain string', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1=value1\n' +
      'key2=value2'

    const kv = parseString(data)
    expect(kv.get('key1')).toEqual('value1')
    expect(kv.get('key2')).toEqual('value2')
  })

  test('Expect parseString() to work with Buffer', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1=value1\n' +
      'key2=value2'

    const kv = parseString(Buffer.from(data))
    expect(kv.get('key1')).toEqual('value1')
    expect(kv.get('key2')).toEqual('value2')
  })
})
