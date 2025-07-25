import crypto from 'node:crypto'

const { SPARK_ID, SPARK_KEY, SPARK_SECRET } = process.env

export function generateSparkWsUrl(uid = 'user') {
  const host = 'spark-api.xf-yun.com'
  const path = '/v1.1/chat'
  const date = new Date().toUTCString()
  const requestLine = `GET ${path} HTTP/1.1`

  const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`
  const hmac = crypto.createHmac('sha256', SPARK_SECRET)
  hmac.update(signatureOrigin)
  const signature = hmac.digest('base64')

  const authorization = `api_key="${SPARK_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
  const authBase64 = Buffer.from(authorization).toString('base64')

  const wsUrl = `wss://${host}${path}?authorization=${authBase64}&date=${encodeURIComponent(date)}&host=${host}`
  return { wsUrl, appId: SPARK_ID, uid }
}
