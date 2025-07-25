import expressAsyncHandler from 'express-async-handler'
import { User } from '../models'
import encrypt from '../utils/encrypt'
import type { RequestHandler } from 'express'

export const register: RequestHandler = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body

  const exists = await User.findOne({ username })
  if (exists)
    return res.fail('Username taken')

  const user = await User.create({
    username,
    password: encrypt.doHash(password),
  })

  const plainUser = user.toObject()
  delete plainUser.password

  res.status(201).success({ data: { user: plainUser } })
})

export const login: RequestHandler = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username }).lean()
  if (!user || !encrypt.compare(password, user.password!))
    return res.fail('Invalid credentials')

  req.session.uid = user._id.toString()

  delete user.password
  res.success({ data: { user } })
})

export const logout: RequestHandler = expressAsyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('SPARK_CHAT_SERVER_ID')
    res.json({ success: true, message: 'Signed out' })
  })
})
