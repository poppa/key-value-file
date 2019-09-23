import fs, { PathLike } from 'fs'
import { promisify } from "util"

const stat = promisify(fs.stat)

export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const exists = async (path: PathLike) => {
  try {
    const s = await stat(path)
    return !!s
  }
  catch (e) {
    return false
  }
}
