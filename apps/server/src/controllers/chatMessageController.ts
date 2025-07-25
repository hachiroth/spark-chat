import expressAsyncHandler from 'express-async-handler'
import type { RequestHandler } from 'express'
import { ChatMessage } from '@/models'
import type { Text } from '@/spark-typed'

export interface Data extends Omit<Text, 'index'> {
  replyTo?: string
}
export async function saveChatMessage(uid: string, conversationId: string, data: Data) {
  const message = await ChatMessage.create({
    uid, 
    conversationId, 
    role: data.role || 'user',
    content: data.content,
    replyTo: data.replyTo
  })
  
  return message.toObject()
}