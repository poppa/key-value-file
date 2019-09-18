import 'jest'
import { KeyValueFile } from '../lib/keyvaluefile'
import { parseFile } from '../lib/methods'
import { join } from 'path'
import { readFile } from '../lib/fs'
import { tmpdir } from 'os'
import { unlinkSync, readFileSync } from 'fs'

function gettmpfile() {
  return join(tmpdir(), 'keyvaluefile-test.env')
}

describe('Test KeyValueFile class', () => {
  let rawData: string
  let kv: KeyValueFile

  beforeEach(async () => {
    const fn = join(__dirname, 'test2.env')
    rawData = (await readFile(fn)).toString()
    kv = await parseFile(fn)
  })

  afterAll(() => {
    unlinkSync(gettmpfile())
  })

  test('Expect KeyValueFile.get() to work', () => {
    const v1 = kv.get('key1')
    const v2 = kv.get('key2')
    const v3 = kv.get('no-such-key')

    expect(v1).toEqual('value1')
    expect(v2).toEqual('value 2')
    expect(v3).toBe(undefined)
  })

  test('Expect KeyValueFile.set() to work', () => {
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

  test('Expect KeyValueFile.rename() to work', () => {
    kv.rename('key2', 'newKey2')

    expect(kv.get('key2')).toBe(undefined)
    expect(kv.get('newKey2')).toEqual('value 2')
  })

  test(
    'Expect KeyValueFile.toString() to give the same output as input',
    () => {
      expect(kv.toString()).toEqual(rawData)
    }
  )

  test('Expect KeyValueFile.delete() to work', () => {
    kv.delete('key2')

    const val2 = kv.get('key2')
    const val3 = kv.get('key3')

    expect(val2).toBe(undefined)
    expect(val3).toEqual('value3')
  })

  test('Expect empty KeyValueFile from scratch to work', () => {
    const kvf = new KeyValueFile(gettmpfile())

    kvf
      .set('key1', 'value1')
      .set('key2', 2)

    const expected =
      // tslint:disable-next-line: prefer-template
      'key1=value1\n' +
      'key2=2'

    expect(kvf.toString()).toEqual(expected)
    expect(kvf.path).toEqual(gettmpfile())
  })

  test('Expect KeyValueFile.writeFile() to work', async () => {
    const kvf = new KeyValueFile(gettmpfile())

    kvf
      .set('key1', 'value1')
      .set('key2', 2)

    const expected =
      // tslint:disable-next-line: prefer-template
      'key1=value1\n' +
      'key2=2'

    await kvf.writeFile()

    const data = readFileSync(gettmpfile()).toString()

    expect(data).toEqual(expected)
  })
})
