import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import routes from './routes'
import { wss } from './ws'
import http from 'http'
import mongoose from 'mongoose'
import { responseWrapper } from './middlewares'

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET || 'No secret',
  resave: false,
  saveUninitialized: false,
}))

app.use(responseWrapper)

const PORT = process.env.PORT || '8080'
const isDev = process.env.NODE_ENV === 'development'

app.get('/', (_, res) => {
  res.send('Hi, Express!')
})

async function connectMongodb() {
  const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spark-chat'

  try {
    await mongoose.connect(URI, {
      dbName: 'spark-chat',
    })

    if (isDev) {
      console.debug('🎉 MongoDB connected.')
    }
  }
  catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}

const server = http.createServer(app)

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req)
  })
})

connectMongodb().then(() => {
app.use(routes({ prefix: '/api' }))
  server.listen(PORT, () => {
    if (isDev) {
      console.debug(`Server run on http://localhost:${PORT}`)
    }
  })
})
