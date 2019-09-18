import 'jest'
import { KeyValue } from '../lib/keyvalue'
import { tokenize } from '../lib/tokenize'

describe('Test KeyValue class', () => {
  test('Expect KeyValue.get() to work', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1 = value1\n' +
      'key2 = value 2\n'

    const kv = new KeyValue(tokenize(data))
    const v1 = kv.get('key1')
    const v2 = kv.get('key2')
    const v3 = kv.get('no-such-key')

    expect(v1).toEqual('value1')
    expect(v2).toEqual('value 2')
    expect(v3).toBe(undefined)
  })

  test('Expect KeyValue.set() to work', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1 = value1\n' +
      'key2 = value 2\n'

    const kv = new KeyValue(tokenize(data))

    kv
      .set('key2', 'new value 2')
      .set('key1', 'new value1')
      .set('key3', 'all new value')

    const v1 = kv.get('key1')
    const v2 = kv.get('key2')
    const v3 = kv.get('key3')

    expect(v1).toEqual('new value1')
    expect(v2).toEqual('new value 2')
    expect(v3).toEqual('all new value')
  })

  test('Expect KeyValue.rename() to work', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1 = value1\n' +
      'key2 = value 2\n'

    const kv = new KeyValue(tokenize(data))

    kv.rename('key2', 'newKey2')

    expect(kv.get('key2')).toBe(undefined)
    expect(kv.get('newKey2')).toEqual('value 2')
  })

  test('Expect KeyValue.toString() to give the same output as input', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1 = value1\n' +
      ' # A comment\n' +
      'key2 = value 2 # Trailing comment\n'

    const kv = new KeyValue(tokenize(data))
    expect(kv.toString()).toEqual(data)
  })

  test('Expect KeyValue.delete() to work', () => {
    const data =
      // tslint:disable-next-line: prefer-template
      'key1 = value1\n' +
      'key2 = value 2\n' +
      'key3 = value3'

    const kv = new KeyValue(tokenize(data))

    kv.delete('key2')

    const val2 = kv.get('key2')
    const val3 = kv.get('key3')

    expect(val2).toBe(undefined)
    expect(val3).toEqual('value3')
  })

  test('Expect empty KeyValue from scratch to work', () => {
    const kv = new KeyValue()

    kv
      .set('key1', 'value1')
      .set('key2', 2)

    const expected =
      // tslint:disable-next-line: prefer-template
      'key1=value1\n' +
      'key2=2'

    expect(kv.toString()).toEqual(expected)
  })
})
