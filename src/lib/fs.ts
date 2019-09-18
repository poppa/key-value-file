import fs from 'fs'
import { promisify } from "util";

// const _stat = promisify(fs.stat)
export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
