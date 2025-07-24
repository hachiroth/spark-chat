import type { Session } from 'express-session'

declare module 'express-session' {
  interface Session {}
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      NODE_ENV: 'development' | 'production' | 'test'
      SECRET: string
    }
  }

  namespace Express {
    interface Request {
      session: Session
    }
    interface Response {}
    interface Locals {}
    interface Application {}
  }
}
