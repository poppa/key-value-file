import 'jest'
import { StringWalker } from '../lib/stringwalker'

describe('Test the StringWalker class', () => {
  test('Expect basic StringWalker methods to pass', () => {
    // tslint:disable-next-line: prefer-template
    const data = `This is a string\n` +
      `with a newline`

    const se = new StringWalker(data)

    expect(se.behind()).toBeNaN()
    expect(se.current()).toEqual(84)
    expect(se.currentChar()).toEqual('T')
    expect(se.nextChar()).toEqual('h')
    expect(se.current()).toEqual(104)
    expect(se.currentChar()).toEqual('h')
    expect(se.behind()).toEqual(84)
    expect(se.behindChar()).toEqual('T')
    expect(se.peek()).toEqual(105)
    expect(se.peekChar()).toEqual('i')
  })
})
