import type { Session } from 'express-session'

declare module 'express-session' {
  interface Session {
    uid: string
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      NODE_ENV: 'development' | 'production' | 'test'
      SPARK_ID: string
      SPARK_SECRET: string
      SPARK_KEY: string
      MONGO_URI: string
      SESSION_SECRET: string
    }
  }

  namespace Express {
    interface Data<T = any> {
      message?: string
      data?: T
    }
    interface CustomResponse {
      fail(message?: string): void
      fail<T>(data: Data<T>): void
      success<T = any>(data: Data<T>): void
    }
    interface Request {
      session: Session
    }

    interface Response extends CustomResponse {}
    interface Locals {}
    interface Application {}
  }
}
