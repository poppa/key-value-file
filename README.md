# key-value-file

This is a simple __key/value file__ parser/writer. Its initial purpose is to
handle parsing of `.env` files.

The main purpose is to be able to alter `.env` files programmatically

# Usage

## Manipulate an existing file

```ts
/* my-environment.env

key1 = value1
key2 = 2

key3= Some value with spaces
*/

import { parseFile } from 'key-value-file'

async function myFunc() {
  const kv = await parseFile('my-environment.env')

  kv
    .rename('key1', 'keyOne')
    .set('key2', 4)
    .delete('key3')
    .set('key4', 'new value')
    .writeFile()
}
```

This will write the following to `my-environment.env`:

```
keyOne = value1
key2 = 4

key4=new value
```

## Create a new file programmatically

`KeyValueFile.create('file.ext')` loads the file if it exists. Otherwise the
file will be created when `KeyValueFile.writeFile()` is called.

```ts
import { KeyValueFile } from 'key-value-file'
const file = KeyValueFile.create('.env')

file
  .set('key1', 'Value 1')
  .set('key2', 'Value 2')
  .addNewline()
  .addComment('Only used in test environment')
  .set('test1', 1)
  .set('test2', 2)
  .writeFile()
```

This will create a file with the following content:

```
key1=Value 1
key2=Value 2

# Only used in test environment
test1=1
test2=2
```

# Quick doc

  * __`async parseFile(path: PathLike): KeyValueFile`__

  * __`KeyValueFile`__
    * __`path`__
      Property that returns the file path of the key/value file.

    * __`set(key: string, value: string | number): this`__
      Set the value of `key` to `value`. If `key` doesn't exist it is created.

    * __`get(key: string): string | undefined`__
      Returns the value of `key`, or `undefined` if the key doesn't exist.

    * __`delete(key: string): this`__
      Delete the key `key` and its value.

    * __`rename(key: string, newName: string): this`__
      Rename the key `key` to `newName`.

    * __`async writeFile(normalizeWhitespace = false): this`__
      Write the current data to the path of `KeyValueFile`. If
      `normalizeWhitespace` is `true` all excessive whitespace will be removed.

    * __`toString(normalizeWhitespace = false): string`__
      Convert the data to a key/value string. If `normalizeWhitespace` is
      `true` all excessive whitespace will be removed.

# TODO

  * ~~__Handle missing/empty values__~~ _(fixed)_
    ~~Things will probably break right now if something like `key= ` occurs.~~

  * __Documentation__
    Oh, how we like that.
