import type { SparkResponse, Text } from './spark-typed'
import WebSocket, { WebSocketServer } from 'ws'
import { generateSparkWsUrl } from './spark'
import { chatMessageController } from "./controllers"

const {saveChatMessage} = chatMessageController

export interface Message extends Omit<Text, 'index'> {
  status?: number
  id?: string
}

export interface WsPool {
  clientWs: WebSocket
  sparkWs: WebSocket
  history: Message[]
}

// 本地 WebSocket 实例
export const wss = new WebSocketServer({ noServer: true })
// 本地和 Spark 的映射
const sessionMap = new Map<string, WsPool>()

/**
 * 构造 spark payload 参数
 * @param uid 用户 ID
 * @param userInput 用户的消息
 * @param history 对话上下文
 * @returns 构造后的 payload
 */
function buildSparkPayload(uid: string, userInput: Message, history: Message[]) {
  return {
    header: {
      app_id: process.env.SPARK_ID!,
      uid,
    },
    parameter: {
      chat: {
        domain: 'lite',
        temperature: 0.5,
        max_tokens: 1024,
      },
    },
    payload: {
      message: {
        text: [
          ...history,
          { role: 'user', content: userInput.content },
        ],
      },
    },
  }
}

// 提取 uid
function extractUid(req: any): string {
  return new URL(req.url, 'http://localhost').searchParams.get('uid') || 'anonymous'
}

function extractSearchParams(req: any, key: string) {
  return new URL(req.url, 'http://localhost').searchParams.get(key) || 'anonymous'
}

// 解析 Spark 返回结果
function parseSparkResponse(raw: SparkResponse): Message | null {
  const response = raw.toString()
  try {
    const obj = JSON.parse(response) as SparkResponse
    const choices = obj.payload.choices
    return {
      role: 'assistant',
      content: choices.text[0].content,
      status: choices.status
    }
  }
  catch {
    return null
  }
}

// 连接本地 WebSocket
wss.on('connection', (clientWs, req) => {
  const uid = extractUid(req)
  const conversationId = extractSearchParams(req, 'conversationId')

  clientWs.onmessage = async (e) => {
    const data = JSON.parse(e.data.toString()) as Message
    let userInput: Message = {
      role: 'user',
      content: data.content,
    }
    const saved = await saveChatMessage(uid, conversationId, userInput)
    userInput = {
      ...userInput,
      id: saved._id.toString()
    }
    callSparkWs(uid,conversationId, clientWs, userInput)
  }

  clientWs.onclose = () => {
    sessionMap.delete(uid)
  }
})

// #region Spark Lite
/**
 * 唤起 Spark 的 ws 连接
 * @param uid 用户 ID
 * @param conversationId 对话 ID
 * @param clientWs 客户端的 WebSocket 实例
 * @param userInput 用户的消息
 */
function callSparkWs(uid: string, conversationId: string, clientWs: WebSocket, userInput: Message) {
  let session = sessionMap.get(uid)

  if (!session) {
    session = {
      clientWs,
      sparkWs: null as any,
      history: [],
    }
    sessionMap.set(uid, session)
  }

  const createSparkWs = () => {
    const { wsUrl } = generateSparkWsUrl(uid)
    const sparkWs = new WebSocket(wsUrl)
    session!.sparkWs = sparkWs

    sparkWs.onopen = () => {
      const payload = buildSparkPayload(uid, userInput, session!.history)
      sparkWs.send(JSON.stringify(payload))
    }

    let totalReply = ''

    sparkWs.onmessage = (e) => {
      const raw = e.data as any as SparkResponse
      const parsedResp = parseSparkResponse(raw)

      const reply: Message = {
        role: 'assistant',
        content: parsedResp!.content,
        status: parsedResp!.status
      }

      totalReply += reply.content || ''
      clientWs.send(JSON.stringify(reply))

      if (reply.status === 2) {
        session!.history.push({ role: 'user', content: userInput.content })
        session!.history.push({ role: 'assistant', content: totalReply })

        saveChatMessage(uid, conversationId, {role: 'assistant', content: totalReply, replyTo: userInput.id})
        totalReply = ''
      }
    }

    sparkWs.onclose = () => {
      session!.sparkWs = null as any
    }

    sparkWs.onerror = (err) => {
    }
  }

  if (!session.sparkWs || session.sparkWs.readyState !== WebSocket.OPEN) {
    if (!session.sparkWs || session.sparkWs.readyState === WebSocket.CLOSED) {
      createSparkWs()
    } else if (session.sparkWs.readyState === WebSocket.CONNECTING) {
    } else {
    }
  } else {
    const payload = buildSparkPayload(uid, userInput, session.history)
    session.sparkWs.send(JSON.stringify(payload))
  }
}
// //#endregion
