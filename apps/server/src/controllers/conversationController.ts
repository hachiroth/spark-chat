import expressAsyncHandler from 'express-async-handler'
import type { RequestHandler } from 'express'
import { Conversation, ChatMessage } from '@/models'

export const create: RequestHandler = expressAsyncHandler(async (req ,res) => {
  const uid = req.session.uid || req.body.uid

  const conversation = await Conversation.create({uid})

  res.success({ data: conversation })
})

export async function getHistories(uid: string, conversationId: string) {
  return await ChatMessage.find({ uid, conversationId })
}

export const resume: RequestHandler = expressAsyncHandler(async (req, res) => {
  const uid = req.session.uid || "68833c4a5a7d01fc6e363d33"
  const conversationId = req.params.conversationId

  const conversation = await Conversation.findById(conversationId)
  const histories = await getHistories(uid,conversationId)

  res.success({data: { conversation, histories }})
})
