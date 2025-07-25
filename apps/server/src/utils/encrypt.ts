import { compareSync, hashSync } from 'bcryptjs'

export default {
  doHash: (password: string, salt = 12) => hashSync(password, salt),
  compare: (password: string, hash: string) => compareSync(password, hash),
}
